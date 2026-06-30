"""Repo-relative path authority for MC agency validation.

This module is intentionally small and deterministic. It rejects unsafe paths before
schema loading or validator execution so Python/jsonschema uses the same trust
boundary as the Node/Ajv runner.
"""

from __future__ import annotations

import re
from pathlib import Path, PureWindowsPath
from typing import Optional


MODULE_DIR = Path(__file__).resolve().parent
REPO_ROOT = MODULE_DIR.parents[1].resolve()
SCHEME_RE = re.compile(r"^[A-Za-z][A-Za-z0-9+.-]*:")


class PathAuthorityError(ValueError):
    """Raised when a path violates the repo-relative trust boundary."""

    def __init__(self, code: str, input_value: object, message: str) -> None:
        super().__init__(message)
        self.code = code
        self.input = input_value


def assert_safe_repo_relative_path(input_value: str, *, must_end_with: Optional[str] = None) -> Path:
    """Return a resolved in-repo path or raise PathAuthorityError.

    Accepted inputs are non-empty POSIX-style repository-relative paths. The
    function rejects URLs, Windows drive paths, absolute paths, backslashes,
    NUL bytes, extension mismatches, and any path that resolves outside the repo.
    """

    if not isinstance(input_value, str) or input_value.strip() == "":
        raise PathAuthorityError("EMPTY_PATH", input_value, "Path must be a non-empty string.")
    if "\x00" in input_value:
        raise PathAuthorityError("NUL_BYTE", input_value, "Path must not contain a NUL byte.")
    if SCHEME_RE.match(input_value):
        raise PathAuthorityError("URL_OR_DRIVE_PATH", input_value, "Path must be repo-relative, not URL-shaped or drive-shaped.")
    if input_value.startswith("/") or Path(input_value).is_absolute() or PureWindowsPath(input_value).is_absolute():
        raise PathAuthorityError("ABSOLUTE_PATH", input_value, "Path must be repo-relative, not absolute.")
    if "\\" in input_value:
        raise PathAuthorityError("WINDOWS_SEPARATOR", input_value, "Path must use forward slashes for stable CI diffs.")
    if must_end_with and not input_value.endswith(must_end_with):
        raise PathAuthorityError("BAD_EXTENSION", input_value, f"Path must end with {must_end_with}.")

    resolved = (REPO_ROOT / input_value).resolve()
    try:
        resolved.relative_to(REPO_ROOT)
    except ValueError as exc:
        raise PathAuthorityError("REPO_ESCAPE", input_value, "Path must resolve inside the repository root.") from exc
    if resolved == REPO_ROOT:
        raise PathAuthorityError("REPO_ESCAPE", input_value, "Path must resolve to a file or directory below the repository root.")
    return resolved


def repo_relative_display_path(absolute_path: Path | str) -> str:
    """Return a stable POSIX repo-relative display path for an in-repo path."""

    resolved = Path(absolute_path).resolve()
    try:
        relative = resolved.relative_to(REPO_ROOT)
    except ValueError as exc:
        raise PathAuthorityError("DISPLAY_REPO_ESCAPE", str(absolute_path), "Display path must resolve inside the repository root.") from exc
    if str(relative) == ".":
        raise PathAuthorityError("DISPLAY_REPO_ESCAPE", str(absolute_path), "Display path must resolve below the repository root.")
    return relative.as_posix()
