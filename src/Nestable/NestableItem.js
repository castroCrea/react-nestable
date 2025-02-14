import React, { Component } from "react";
import PropTypes from "prop-types";
import cn from "classnames";

import Icon from "../Icon";

class NestableItem extends Component {
  static propTypes = {
    item: PropTypes.shape({
      id: PropTypes.any.isRequired
    }),
    isCopy: PropTypes.bool,
    options: PropTypes.object,
    index: PropTypes.number
  };

  renderCollapseIcon = ({ isCollapsed }) => (
    <Icon
      className={cn("nestable-item-icon", {
        "icon-plus-gray": isCollapsed,
        "icon-minus-gray": !isCollapsed
      })}
    />
  );

  render() {
    const { item, isCopy, options, index } = this.props;
    const {
      dragItem,
      renderItem,
      handler,
      childrenProp,
      renderCollapseIcon = this.renderCollapseIcon
    } = options;
    const isCollapsed = options.isCollapsed(item);

    const isDragging = !isCopy && dragItem && dragItem.id === item.id;
    const hasChildren = item[childrenProp] && item[childrenProp].length > 0;

    let Handler;

    let itemProps = {
      className: cn(
        "nestable-item" + (isCopy ? "-copy" : ""),
        "nestable-item" + (isCopy ? "-copy" : "") + "-" + item.id,
        {
          "is-dragging": isDragging
        }
      )
    };

    let rowProps = {};
    let handlerProps = {};
    if (!isCopy) {
      if (dragItem) {
        rowProps = {
          ...rowProps,
          onMouseEnter: e => options.onMouseEnter(e, item)
        };
      } else {
        handlerProps = {
          ...handlerProps,
          draggable: true,
          onDragStart: e => options.onDragStart(e, item)
        };
      }
    }

    if (handler) {
      Handler = (
        <span className="nestable-item-handler" {...handlerProps}>
          {handler}
        </span>
      );
      //Handler = React.cloneElement(handler, handlerProps);
    } else {
      rowProps = {
        ...rowProps,
        ...handlerProps
      };
    }

    const collapseIcon = hasChildren ? (
      <span onClick={() => options.onToggleCollapse(item)}>
        {renderCollapseIcon({ isCollapsed })}
      </span>
    ) : null;

    return (
      <li {...itemProps}>
        <div className="nestable-item-name" {...rowProps}>
          {renderItem({ item, collapseIcon, handler: Handler, index })}
        </div>

        {hasChildren && !isCollapsed && (
          <ol className="nestable-list">
            {item[childrenProp].map((item, i) => {
              return (
                <NestableItem
                  key={i}
                  index={i}
                  item={item}
                  options={options}
                  isCopy={isCopy}
                />
              );
            })}
          </ol>
        )}
      </li>
    );
  }
}

export default NestableItem;
