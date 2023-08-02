import {
  BaseFilter,
  BaseFilterParams,
  DduItem,
} from "https://deno.land/x/ddu_vim@v3.4.4/types.ts";
import { fn } from "https://deno.land/x/ddu_vim@v3.4.4/deps.ts";
import {
  isAbsolute,
  relative,
} from "https://deno.land/std@0.196.0/path/mod.ts";
import { is } from "https://deno.land/x/unknownutil@v3.4.0/mod.ts";
import { FilterArguments } from "https://deno.land/x/ddu_vim@v3.4.4/base/filter.ts";

function getPath(item: DduItem): string | undefined {
  if (is.ObjectOf({ action: is.ObjectOf({ path: is.String }) })(item)) {
    return item.action.path;
  }
}

export class Filter extends BaseFilter<BaseFilterParams> {
  async filter(
    { items, denops }: FilterArguments<BaseFilterParams>,
  ): Promise<DduItem[]> {
    const cwd = await fn.getcwd(denops);
    return Promise.resolve(items.map((item) => {
      const path = getPath(item);
      if (path === undefined || !isAbsolute(path)) {
        return item;
      }
      const { word, display = word } = item;
      console.log({ display, path });
      if (display !== path) {
        return item;
      }

      const relPath = relative(cwd, display);

      item.display = relPath;

      return item;
    }));
  }
  params() {
    return {};
  }
}
