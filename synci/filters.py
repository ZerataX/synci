import sass
from webassets.filter import Filter


class SassFilter(Filter):
    name = "pysass"

    def output(self, _in, out, **kwargs):
        out.write(_in.read())

    def input(self, _in, out, **kwargs):
        out.write(sass.compile(filename=kwargs.get("source_path"),
                               output_style="compact"))
