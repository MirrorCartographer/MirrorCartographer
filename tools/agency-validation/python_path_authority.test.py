from pathlib import Path

import pytest

from python_path_authority import (
    REPO_ROOT,
    PathAuthorityError,
    assert_safe_repo_relative_path,
    repo_relative_display_path,
)


def assert_rejects(path_value, expected_code, **options):
    with pytest.raises(PathAuthorityError) as error:
        assert_safe_repo_relative_path(path_value, **options)
    assert error.value.code == expected_code


def test_accepts_repo_relative_json_path():
    resolved = assert_safe_repo_relative_path("mind/schemas/raw-validator-error-capture.v1.schema.json", must_end_with=".json")
    assert resolved.is_absolute()
    assert resolved.name == "raw-validator-error-capture.v1.schema.json"
    assert resolved.relative_to(REPO_ROOT)


def test_rejects_unsafe_path_classes_before_validation():
    assert_rejects("", "EMPTY_PATH")
    assert_rejects("https://example.com/schema.json", "URL_OR_DRIVE_PATH")
    assert_rejects("C:/tmp/schema.json", "URL_OR_DRIVE_PATH")
    assert_rejects("/tmp/schema.json", "ABSOLUTE_PATH")
    assert_rejects("mind\\schemas\\x.json", "WINDOWS_SEPARATOR")
    assert_rejects("mind/schemas/x.txt", "BAD_EXTENSION", must_end_with=".json")
    assert_rejects("../outside.json", "REPO_ESCAPE")
    assert_rejects("mind/schemas/x.json\x00", "NUL_BYTE")


def test_display_path_rejects_escape_and_normalizes_separator():
    resolved = assert_safe_repo_relative_path("mind/schemas/repair-category-map.v1.schema.json", must_end_with=".json")
    assert repo_relative_display_path(resolved) == "mind/schemas/repair-category-map.v1.schema.json"

    with pytest.raises(PathAuthorityError) as error:
        repo_relative_display_path(Path("/tmp/outside.json"))
    assert error.value.code == "DISPLAY_REPO_ESCAPE"
