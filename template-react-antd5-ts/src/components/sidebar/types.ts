
export interface ILink {
    path: string,
    help?: string | JSX.Element,
    tip?: string | JSX.Element,
    title: string | JSX.Element,
    group?: string,
    icon?: string | React.ReactNode,
    children?: Array<ILink>
}

export interface SidebarProps {
    links: Array<ILink>,
    className?: string,
    withParams?: boolean,
    width?: string | number,
    height?: string | number,
    style?: React.CSSProperties,
    fixed?: boolean,
    offsetTop?: number,
    theme?: "light" | "dark",
    defaultOpenKeys?: string[],
    defaultSelectedKeys?: string[],
    selectedKeys?: string[],
    openKeys?: string[],
    onOpenChange?: (openKeys: string[]) => void,
    onTitleClick?: (event: any, item: any) => void,
    showSearch?: boolean,
    addonBefore?: string | JSX.Element,
    addonAfter?: string | JSX.Element,
    loading?: boolean,
    renderItem?: (item: ILink) => JSX.Element,
    onItemClick?: (e: any, item: any) => any,
    history: any,
    location: any,
}