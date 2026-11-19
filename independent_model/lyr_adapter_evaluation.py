"""Transparent *heuristic* screen for tiny synthetic model outputs.

Not an independent judge of truth, useful conversation, or safety. The
rule-based checks are deliberately narrow and marked as such in reports.
"""
import re
from collections import defaultdict

LEXICAL_CUES = {
    "causal-inquiry": (
        r"\b(observ\w*|record\w*|evidence)\b",
        r"\b(not proof|not establish\w*|not necessarily|cannot prove|does not prove|uncertain)\b",
        r"\b(test|repe\w*|compar\w*|disable\w*|trial)\b",
    ),
    "contradiction-routing": (
        r"\b(conflict|contradic\w*|disagree\w*|inconsisten\w*)\b",
        r"\b(record\w*|sourc\w*|evidence|measur\w*)\b",
        r"\b(correct\w*|revis\w*|supersed\w*|reconcil\w*)\b",
    ),
    "inference-boundary": (
        r"\b(interpret\w*|assum\w*|infer\w*|hypothes\w*)\b",
        r"\b(not proof|not eviden\w*|cannot|unknown|uncertain|unverified|not establish\w*)\b",
        r"\b(observ\w*|test|predict\w*|measur\w*)\b",
    ),
}

def lexical_grade(task, response):
    if task not in LEXICAL_CUES:
        raise ValueError("Unknown evaluation task.")
    if not isinstance(response,str):
        raise TypeError("Model response must be text.")
    return sum(bool(re.search(pattern,response,flags=re.I)) for pattern in LEXICAL_CUES[task])

def summarize(rows):
    groups=defaultdict(list)
    for row in rows:
        groups[row["task"]].append(row["score"])
    return {
        "overall_average":round(sum(x["score"] for x in rows)/len(rows),3) if rows else None,
        "by_task":{task:round(sum(values)/len(values),3) for task,values in groups.items()},
        "sample_count":len(rows),
        "max_score_per_sample":3,
        "status":"HEURISTIC_ONLY_NOT_A_CONVERSATIONAL_BENCHMARK"
    }
