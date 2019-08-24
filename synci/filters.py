import os
import sass
from webassets.filter import Filter


class SassFilter(Filter):
    name = "pysass"

    def output(self, _in, out, **kwargs):
        out.write(_in.read())

    def input(self, _in, out, **kwargs):
        dir = [os.path.dirname(kwargs.get("source_path"))]
        out.write(sass.compile(string=_in.read(),
                               output_style="compact",
                               indented=True,
                               include_paths=dir))
