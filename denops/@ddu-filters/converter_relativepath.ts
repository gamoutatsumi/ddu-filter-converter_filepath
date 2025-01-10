import {
  BaseFilter,
  BaseFilterParams,
  DduItem,
} from "jsr:@shougo/ddu-vim@9.4.0/types";
import * as fn from "jsr:@denops/std@7.4.0/function";
import { isAbsolute, relative } from "jsr:@std/path@1.0.8";
import { is } from "jsr:@core/unknownutil@4.3.0";
import { FilterArguments } from "jsr:@shougo/ddu-vim@9.4.0/filter";

function getPath(item: DduItem): string | undefined {
  if (is.ObjectOf({ action: is.ObjectOf({ path: is.String }) })(item)) {
    return item.action.path;
  }
}

export class Filter extends BaseFilter<BaseFilterParams> {
  async filter({
    items,
    denops,
  }: FilterArguments<BaseFilterParams>): Promise<DduItem[]> {
    const cwd = await fn.getcwd(denops);
    return Promise.resolve(
      items.map((item) => {
        const path = getPath(item);
        if (path === undefined || !isAbsolute(path)) {
          return item;
        }
        const { word, display = word, matcherKey } = item;
        if (display !== path) {
          return item;
        }

        const relPath = relative(cwd, display);

        if (matcherKey === path) {
          item.matcherKey = relPath;
        }
        item.word = relPath;
        item.display = relPath;

        return item;
      }),
    );
  }
  params() {
    return {};
  }
}
