import { type Signal, component$ } from "@builder.io/qwik";
import SproutIcon from "/src/images/Sprout_icon.svg?jsx";
import { Search } from "./search";
import { FilterButton } from "./filter-button";

/**
 * The navbar shows the project logo and name, contains the search and allows to configure the filter.
 */
export const Navbar = component$(
  (props: {
    filterActive: Signal<boolean>;
    filterWindowActive: Signal<boolean>;
    listExpanded: Signal<boolean>;
    searchText: Signal<string>;
  }) => {
    return (
      <div class="navbar w-max space-x-2 bg-base-100">
        <div class="navbar-start">
          <a href="/" class="btn btn-ghost flex items-center text-2xl">
            <SproutIcon class="size-8" />
            Sprout
          </a>
        </div>
        <div class="navbar-end space-x-1">
          <Search
            listExpanded={props.listExpanded}
            searchText={props.searchText}
          />
          <FilterButton
            filterActive={props.filterActive}
            filterWindowActive={props.filterWindowActive}
          />
        </div>
      </div>
    );
  },
);
