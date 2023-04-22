import * as React from "react";
import cn from "@/lib/cn";
import * as Collapsible from "@radix-ui/react-collapsible";
import { ChevronRight } from "lucide-react";

type CollapsibleContextValue = {
  isExpandable: (id: string) => boolean;
  isExpanded: (id: string) => boolean;
  isSelected: (id: string) => boolean;
  selectNode: (event: React.SyntheticEvent, id: string) => void;
  toggleExpansion: (id: string) => void;
};

const TreeViewContext = React.createContext<
  CollapsibleContextValue | undefined
>(undefined);

function useTreeViewContext() {
  const context = React.useContext(TreeViewContext);

  if (!context) {
    throw Error(
      "The useTreeViewContext hook must be called inside TreeViewContext Provider."
    );
  }

  return context;
}

/* -------------------------------------------------------------------------------------------------
 * TreeView
 * -----------------------------------------------------------------------------------------------*/

const TREE_VIEW_NAME = "TreeViewName";

interface TreeViewProps extends React.HTMLAttributes<HTMLUListElement> {
  // FIXME:
  map: any;
}

const TreeView = React.forwardRef<HTMLUListElement, TreeViewProps>(
  (props, forwardedRef) => {
    const { className, map, ...rest } = props;

    const [expanded, setExpandedState] = React.useState<string[]>([]);

    const [selected, setSelectedState] = React.useState<string | null>(null);

    const isExpanded = React.useCallback(
      (id: string) =>
        Array.isArray(expanded) ? expanded.indexOf(id) !== -1 : expanded === id,
      [expanded]
    );

    const isSelected = React.useCallback(
      (id: string) =>
        Array.isArray(selected) ? selected.indexOf(id) !== -1 : selected === id,
      [selected]
    );

    const isExpandable = (id: string) => {
      const { children } = map[id];

      return Array.isArray(children) ? true : children;
    };

    const selectNode = (event: React.SyntheticEvent, id: string) => {
      setSelectedState(id);
    };

    const toggleExpansion = (id: string) => {
      let newExpanded;

      if (expanded.indexOf(id) !== -1) {
        newExpanded = expanded.filter((expandedId) => expandedId !== id);
      } else {
        newExpanded = [id].concat(expanded);
      }

      setExpandedState(newExpanded);
    };

    return (
      <TreeViewContext.Provider
        value={{
          isExpanded,
          isExpandable,
          isSelected,
          selectNode,
          toggleExpansion,
        }}
      >
        <ul
          className={cn("px-1", className)}
          ref={forwardedRef}
          role="tree"
          tabIndex={0}
          {...rest}
        />
      </TreeViewContext.Provider>
    );
  }
);

TreeView.displayName = TREE_VIEW_NAME;

const ITEM_NAME = "TreeViewItem";

interface TreeViewItemProps extends React.HTMLAttributes<HTMLLIElement> {
  label: React.ReactNode;
  /**
   * Tree node id.
   */
  nodeId: string;
}

const TreeViewItem = React.forwardRef<HTMLLIElement, TreeViewItemProps>(
  (props, forwardedRef) => {
    const { children, label, onClick, nodeId, ...rest } = props;

    const {
      isExpanded,
      isExpandable,
      isSelected,
      toggleExpansion,
      selectNode,
    } = useTreeViewContext();

    const expandable = isExpandable(nodeId);
    const selected = isSelected(nodeId);
    const expanded = isExpanded(nodeId);

    const handleClick: React.MouseEventHandler<HTMLLIElement> = (event) => {
      selectNode(event, nodeId);
      onClick?.(event);

      event.stopPropagation();
    };

    return (
      <li
        aria-expanded={expandable ? expanded : undefined}
        aria-selected={selected}
        onClick={handleClick}
        ref={forwardedRef}
        role="treeitem"
        tabIndex={-1}
        {...rest}
      >
        {expandable ? (
          <Collapsible.Root
            onOpenChange={() => {
              toggleExpansion(nodeId);
            }}
            open={expanded}
          >
            <span
              className={cn("inline-block px-1 align-middle hover:bg-accent", {
                // ["bg-ring text-primary  hover:bg-ring"]: selected,
              })}
            >
              <span className={cn("flex items-center px-1")}>
                <Collapsible.Trigger
                  aria-expanded={undefined}
                  asChild
                  className="text-accent-1"
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                  }}
                  tabIndex={-1}
                  type={undefined}
                >
                  <span className="focus-visible:outline-none ">
                    <ChevronRight
                      className={cn({ ["rotate-90"]: expanded })}
                      size={16}
                    />
                  </span>
                </Collapsible.Trigger>

                <span className="inline-block cursor-default select-none">
                  {label}
                </span>
              </span>
            </span>
            {children && (
              <Collapsible.Content className="ml-10">
                <ul role="group">{children}</ul>
              </Collapsible.Content>
            )}
          </Collapsible.Root>
        ) : (
          <span
            className={cn("inline-block px-1 align-top hover:bg-accent", {
              // ["bg-ring text-primary hover:bg-ring"]: selected,
            })}
          >
            {label}
          </span>
        )}
      </li>
    );
  }
);

TreeViewItem.displayName = ITEM_NAME;

/* -----------------------------------------------------------------------------------------------*/

const Root = TreeView;
const Item = TreeViewItem;

export {
  TreeView,
  TreeViewItem,
  //
  Root,
  Item,
};
export type { TreeViewProps, TreeViewItemProps };
