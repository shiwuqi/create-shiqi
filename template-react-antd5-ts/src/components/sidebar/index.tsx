import { FC, CSSProperties, ReactNode, isValidElement } from 'react';
import { Spin, Menu, Affix, Popover } from 'antd';
import { LoadingOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { SidebarProps, ILink as LILink } from './types';

import './index.css';

export interface ILink extends LILink { }

const { SubMenu } = Menu

const Sidebar: FC<SidebarProps> = (props) => {
    const {
        links = [],
        className,
        withParams,
        width,
        height,
        style,
        fixed,
        offsetTop,
        theme,
        defaultOpenKeys,
        defaultSelectedKeys,
        selectedKeys,
        openKeys,
        onOpenChange,
        onTitleClick,
        showSearch,
        addonBefore,
        addonAfter,
        loading,
        renderItem,
        onItemClick,
        history,
        location
    } = props

    // 处理menu item点击事件参数
    // 添加title 参数
    function handleMenuItemClick(e: any, each: ILink) {
        // 拼接参数函数
        const combineParamsAndPushUrl = () => {
            let url = e.key
            if (withParams) {
                let _href = window.location.href
                let strIndex = _href.indexOf("?")
                if (strIndex !== -1) {
                    let str = _href.substring(strIndex)
                    url = `${url}${str}`
                }
            }

            // 如果匹配则说明是站外链接
            if (url.indexOf("http://") >= 0 || url.indexOf("https://") >= 0 || url.indexOf("//") >= 0) {
                // 创建a标签并为其添加属性
                let otherLink = document.createElement('a')
                otherLink.href = url
                otherLink.target = "_blank"
                // 触发点击事件执行下载
                otherLink.click()
            } else {
                if (history && typeof history === "function") {
                    history(url)
                } else {
                    history && history.push(url)
                }
            }
        }

        const hanldeOnClick = () => {
            let keyPath = e.keyPath
            let arr = []
            arr.push(e.title)

            links && links.forEach((each: ILink, index: number) => {
                if (each.path === keyPath[1]) {
                    arr.push(each.title)
                }
            })

            e.titlePath = arr
            const result = onItemClick && onItemClick(e, each);

            if (result !== false) {
                combineParamsAndPushUrl()
            }
        }

        // 当存在onClick时调用onClick并且当onClick的return 为false时取消默认的
        // 拼接参数行为
        if (onItemClick) {
            hanldeOnClick()
        } else {
            combineParamsAndPushUrl()
        }
    }

    function handleTitleClick(e: any, each: ILink) {
        if (onTitleClick) {
            onTitleClick(e, each)
        }
    }

    function renderAddonBefore() {
        return addonBefore
    }

    function renderAddonAfter() {
        return addonAfter
    }

    function renderHelp(item: ILink) {
        return <Popover placement="right" content={<div style={{ maxWidth: 350 }}>{item.help || item.tip}</div>}>
            {item.title}<QuestionCircleOutlined style={{ marginLeft: 8 }} />
        </Popover>
    }

    function renderMenuItem(item: ILink) {
        // 如果存在自定义渲染item则直接返回自定义内容
        if (renderItem) {
            const _node = renderItem(item)
            if (_node) {
                return _node
            } else if (item.help || item.tip) {
                return renderHelp(item)
            } else {
                return item.title
            }
        } else if (item.help || item.tip) {
            return renderHelp(item)
        } else {
            return item.title
        }
    }

    function renderChildren(children: Array<ILink>) {
        // filter children是否含有group，并根据group分组
        let obj: any = {}
        children.forEach(each => {
            if (each.group) {
                if (obj[each.group]) {
                    obj[each.group].push(each)
                } else {
                    obj[each.group] = []
                    obj[each.group].push(each)
                }
            }
        })

        // 根据obj的长度判断是否有group存在，传进来的参数children只有两种情况
        // 一种是都有group字段，一种是都没有group字段，不允许同时出现两种情况
        let keys = Object.keys(obj)

        // 渲染group
        if (keys.length > 0) {
            return keys.map((each: any, index: number) => {
                const { icon } = each;
                const iconDom = !icon ? null : isValidElement(icon) ? icon : <i className={icon}></i>;
                return <Menu.ItemGroup key={index} title={each}>
                    {
                        obj[each].map((item: ILink, itemIndex: number) => {
                            if (item.children) {
                                return renderChildren(item.children)
                            }

                            return <Menu.Item icon={iconDom} onClick={(e) => handleMenuItemClick(e, each)} key={item.path}>
                                {renderMenuItem(item)}
                            </Menu.Item>
                        })
                    }
                </Menu.ItemGroup>
            })
        } else { //渲染subMenu
            return children.map((each: any, index) => {
                const { icon } = each;
                const iconDom = !icon ? null : isValidElement(icon) ? icon : <i className={icon}></i>;
                if (each.children) {
                    return <SubMenu key={each.path} title={each.title} icon={iconDom} onTitleClick={(e) => handleTitleClick(e, each)}>
                        {renderChildren(each.children)}
                    </SubMenu>
                } else {
                    return <Menu.Item icon={iconDom} onClick={(e) => handleMenuItemClick(e, each)} key={each.path}>{renderMenuItem(each)}</Menu.Item>
                }

            })
        }
    }

    function getCurrentSelectedKey(arr: ILink[] | undefined) {
        let currentShouldSelectedUrl: string = ""

        if (arr) {
            for (let i = 0, length = arr.length; i < length; i++) {
                if (arr[i].children) {
                    const _url = getCurrentSelectedKey(arr[i].children)
                    currentShouldSelectedUrl = _url
                    break
                } else {
                    if (location && location.pathname == arr[i].path) {
                        currentShouldSelectedUrl = arr[i].path
                        break
                    }
                }
            }
        }

        return currentShouldSelectedUrl
    }

    function renderMenu() {
        const _props = {
            defaultOpenKeys,
            openKeys,
            selectedKeys,
            theme,
            onOpenChange
        }

        let _defaultSelectedKeys: string[] = []

        if (selectedKeys && selectedKeys.length) {
            _defaultSelectedKeys = selectedKeys
        } else if (defaultSelectedKeys && defaultSelectedKeys.length) {
            _defaultSelectedKeys = defaultSelectedKeys
        } else {
            const _shouldSelectedKey = getCurrentSelectedKey(links)
            _defaultSelectedKeys = [_shouldSelectedKey]
        }

        _props.selectedKeys = _defaultSelectedKeys

        if (fixed) {
            return (
                <Affix offsetTop={offsetTop}>
                    <div className={`fan-sidebar-wrap fan-fixed-wrap ${theme === "dark" ? "fan-dark" : ""}`} style={{ height }}>
                        {renderAddonBefore()}
                        <Menu className={theme === "dark" ? "fan-sidebar fan-dark" : "fan-sidebar"}
                            {..._props}
                            style={{ border: "none" }}
                            mode="inline"
                        >
                            {renderChildren(links)}
                        </Menu>
                        {renderAddonAfter()}
                    </div>
                </Affix>
            );
        }

        return (
            <div className={theme === "dark" ? "fan-sidebar-wrap fan-dark" : "fan-sidebar-wrap"}>
                {renderAddonBefore()}
                <Menu className={theme === "dark" ? "fan-sidebar fan-dark" : "fan-sidebar"}
                    {..._props}
                    style={{ height }}
                    mode="inline"
                >
                    {renderChildren(links)}
                </Menu>
                {renderAddonAfter()}
            </div>
        );
    }

    const defaultStyle = {
        width,
        ...style
    }

    return <div className={`${className ? `${className} fan-sidebar-container` : "fan-sidebar-container"}`} style={defaultStyle}>
        {loading ? <div className="fan-sidebar-loading">
            <Spin indicator={<LoadingOutlined />}></Spin>
        </div> : renderMenu()}
    </div>

}

export default Sidebar;