# -*- coding: utf-8 -*-
from pathlib import Path
import importlib.util
ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("dba", ROOT / "scripts" / "deep_batch_a.py")
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)
emit_post, write_batch = mod.emit_post, mod.write_batch
A=[]
def add(slug,title,date,desc,sections):
    A.append(emit_post(slug,title,date,desc,sections))

# posts loaded from companion data file
exec((ROOT/"scripts"/"deep_a_rest_data.py").read_text(encoding="utf-8"))
write_batch("batch-a-rest","batchARest",A)
print(len(A))
