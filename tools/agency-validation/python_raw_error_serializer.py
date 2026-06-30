"""Serialize python-jsonschema ValidationError objects into MC raw evidence captures.

This module is intentionally small and deterministic. It preserves structural
validator evidence for debugging while keeping CI convergence outside message
wording, raw error order, and jsonschema heuristics such as best_match.
"""

from __future__ import annotations

import hashlib
import json
from collections.abc import Iterable, Sequence
from importlib import metadata
from typing import Any

DIALECT_2020_12 = "https://json-schema.org/draft/2020-12/schema"
RAW_CAPTURE_VERSION = "raw-validator-error-capture.v1"
MAX_NESTED_DEPTH = 4


def json_pointer_from_path_segments(segments: Iterable[str | int]) -> str:
    """Return an RFC 6901 JSON Pointer from path segments.

    Root is represented by the empty string. Tilde and slash are escaped using
    the RFC 6901 token substitutions.
    """

    parts: list[str] = []
    for segment in segments:
        token = str(segment).replace("~", "~0").replace("/", "~1")
        parts.append(token)
    return "" if not parts else "/" + "/".join(parts)


def _stable_json(value: Any) -> str:
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"), default=repr)


def safe_json_value_summary(value: Any, max_chars: int = 240, max_items: int = 12) -> dict[str, Any]:
    """Return a bounded summary without dumping full instance or schema objects."""

    summary: dict[str, Any] = {"python_type": type(value).__name__}

    if isinstance(value, dict):
        keys = sorted(str(key) for key in value.keys())
        summary.update({"container": "object", "size": len(value), "keys_sample": keys[:max_items]})
    elif isinstance(value, (list, tuple)):
        summary.update({"container": "array", "size": len(value)})
        summary["items_sample"] = [safe_json_value_summary(item, max_chars=80, max_items=4) for item in list(value)[:max_items]]
    else:
        summary["repr"] = repr(value)

    encoded = _stable_json(summary)
    if len(encoded) > max_chars:
        digest = hashlib.sha256(encoded.encode("utf-8")).hexdigest()[:16]
        return {
            "python_type": type(value).__name__,
            "truncated": True,
            "sha256_16": digest,
            "summary_chars": len(encoded),
        }

    summary["truncated"] = False
    return summary


def _segments(value: Any) -> list[str | int]:
    if value is None:
        return []
    try:
        return list(value)
    except TypeError:
        return []


def _raw_error_id(fixture_id: str, source_order: int, keyword: str, instance_pointer: str, schema_pointer: str) -> str:
    material = _stable_json(
        {
            "fixture_id": fixture_id,
            "source_order": source_order,
            "keyword": keyword,
            "instance_pointer": instance_pointer,
            "schema_pointer": schema_pointer,
        }
    )
    return "raw-" + hashlib.sha256(material.encode("utf-8")).hexdigest()[:24]


def _content_hash(value: Any) -> str:
    return "sha256:" + hashlib.sha256(_stable_json(value).encode("utf-8")).hexdigest()


def _validator_version() -> str:
    try:
        return metadata.version("jsonschema")
    except metadata.PackageNotFoundError:
        return "unknown"


def serialize_nested_validation_error(error: Any, source_order: int = 0, include_message: bool = True, depth: int = 0) -> dict[str, Any]:
    """Serialize a nested context error into the schema's compact nested shape."""

    keyword = str(getattr(error, "validator", None) or "unknown")
    instance_segments = _segments(getattr(error, "absolute_path", None) or getattr(error, "path", None))
    schema_segments = _segments(getattr(error, "absolute_schema_path", None) or getattr(error, "schema_path", None))

    raw_params: dict[str, Any] = {
        "source_order": source_order,
        "validator_value_summary": safe_json_value_summary(getattr(error, "validator_value", None)),
    }
    cause = getattr(error, "cause", None)
    if cause is not None:
        raw_params["cause_type"] = type(cause).__name__

    item: dict[str, Any] = {
        "keyword": keyword,
        "instance_pointer": json_pointer_from_path_segments(instance_segments),
        "schema_pointer": json_pointer_from_path_segments(schema_segments),
        "raw_params": raw_params,
    }
    if include_message:
        item["message"] = str(getattr(error, "message", ""))

    return item


def serialize_validation_error(
    error: Any,
    fixture_id: str,
    source_order: int = 0,
    include_message: bool = True,
    depth: int = 0,
) -> dict[str, Any]:
    """Serialize one jsonschema.ValidationError as a raw_errors[] item."""

    keyword = str(getattr(error, "validator", None) or "unknown")
    instance_segments = _segments(getattr(error, "absolute_path", None) or getattr(error, "path", None))
    schema_segments = _segments(getattr(error, "schema_path", None))
    absolute_schema_segments = _segments(getattr(error, "absolute_schema_path", None) or getattr(error, "schema_path", None))

    instance_pointer = json_pointer_from_path_segments(instance_segments)
    schema_pointer = json_pointer_from_path_segments(schema_segments)
    absolute_schema_pointer = json_pointer_from_path_segments(absolute_schema_segments)

    message_policy: dict[str, Any] = {
        "message_captured": bool(include_message),
        "message_is_ci_invariant": False,
    }
    if include_message:
        message_policy["message"] = str(getattr(error, "message", ""))

    raw_params: dict[str, Any] = {
        "source_order": source_order,
        "validator_value_summary": safe_json_value_summary(getattr(error, "validator_value", None)),
    }
    cause = getattr(error, "cause", None)
    if cause is not None:
        raw_params["cause_type"] = type(cause).__name__

    item: dict[str, Any] = {
        "raw_error_id": _raw_error_id(fixture_id, source_order, keyword, instance_pointer, schema_pointer),
        "keyword": keyword,
        "instance_location": {
            "pointer": instance_pointer,
            "path_segments": instance_segments,
        },
        "schema_location": {
            "pointer": schema_pointer,
            "absolute_pointer": absolute_schema_pointer,
            "path_segments": schema_segments,
        },
        "message_policy": message_policy,
        "raw_params": raw_params,
    }

    json_path = getattr(error, "json_path", None)
    if json_path:
        item["instance_location"]["json_path"] = str(json_path)

    context = list(getattr(error, "context", ()) or ())
    if context and depth < MAX_NESTED_DEPTH:
        nested = [
            serialize_nested_validation_error(suberror, source_order=index, include_message=include_message, depth=depth + 1)
            for index, suberror in enumerate(context)
        ]
        item["nested_raw_errors"] = sorted(
            nested,
            key=lambda entry: (entry["instance_pointer"], entry["schema_pointer"], entry["keyword"], entry["raw_params"].get("source_order", 0)),
        )

    return item


def serialize_validation_errors(errors: Sequence[Any] | Iterable[Any], fixture_id: str, include_message: bool = True) -> list[dict[str, Any]]:
    """Serialize and structurally sort ValidationError objects for byte-stable output."""

    serialized = [
        serialize_validation_error(error, fixture_id=fixture_id, source_order=index, include_message=include_message)
        for index, error in enumerate(list(errors))
    ]
    return sorted(
        serialized,
        key=lambda entry: (
            entry["instance_location"]["pointer"],
            entry["schema_location"]["pointer"],
            entry["keyword"],
            entry["raw_params"].get("source_order", 0),
        ),
    )


def build_python_raw_error_capture(
    *,
    fixture_id: str,
    fixture_path: str,
    schema_id: str,
    schema_path: str,
    errors: Sequence[Any] | Iterable[Any],
    fixture_content: Any | None = None,
    schema_content: Any | None = None,
    include_message: bool = True,
    format_assertion: str = "disabled",
) -> dict[str, Any]:
    """Build a raw-validator-error-capture.v1 envelope for python-jsonschema."""

    raw_errors = serialize_validation_errors(errors, fixture_id=fixture_id, include_message=include_message)
    capture_material = _stable_json(
        {
            "fixture_id": fixture_id,
            "schema_id": schema_id,
            "validator": "python-jsonschema",
            "error_ids": [entry["raw_error_id"] for entry in raw_errors],
        }
    )

    fixture_ref: dict[str, Any] = {"path": fixture_path, "fixture_id": fixture_id}
    if fixture_content is not None:
        fixture_ref["content_hash"] = _content_hash(fixture_content)

    schema_ref: dict[str, Any] = {"path": schema_path, "schema_id": schema_id}
    if schema_content is not None:
        schema_ref["content_hash"] = _content_hash(schema_content)

    return {
        "schema_version": RAW_CAPTURE_VERSION,
        "capture_id": "rvec-" + hashlib.sha256(capture_material.encode("utf-8")).hexdigest()[:24],
        "validator": {
            "name": "python-jsonschema",
            "version": _validator_version(),
            "runtime": "python",
            "dialect": DIALECT_2020_12,
        },
        "validation_policy": {
            "format_assertion": format_assertion,
            "all_errors": True,
            "message_capture": "captured_debug_only" if include_message else "disabled",
            "error_order_is_asserted": False,
        },
        "fixture_ref": fixture_ref,
        "schema_ref": schema_ref,
        "result": {
            "valid": len(raw_errors) == 0,
            "error_count": len(raw_errors),
        },
        "raw_errors": raw_errors,
        "normalization_guardrail": {
            "raw_messages_do_not_define_repair_category": True,
            "raw_order_do_not_define_convergence": True,
            "validator_agreement_does_not_score_symbolic_truth": True,
            "note": "Python jsonschema raw errors are debug evidence only; canonical repair receipts define CI convergence.",
        },
    }
