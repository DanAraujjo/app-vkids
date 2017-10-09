import { Pipe } from "@angular/core";

@Pipe({ name: "sortBy" })
export class SortPipe {
 transform(array: Array<string>): Array<string> {

  if(!array || array === undefined || array.length === 0) return null;

    array.sort((a: any, b: any) => {
      if (a.snippet.title < b.snippet.title) {
        return -1;
      } else if (a.snippet.title > b.snippet.title) {
        return 1;
      } else {
        return 0;
      }
    });
    return array;
  }
}