import { CSSProperties, MouseEvent } from 'react';

export interface ILink {
    /**
     * 路由地址
     */
    url: string;
    /**
     * 匹配
     */
    match?: string;
    /**
     * 样式
     */
    style?: CSSProperties;
    /**
     * 标题
     */
    title: string;
    /**
     * 前缀
     */
    prefix?: string;
    /**
     * className
     */
    className?: string;
    /**
     * 点击事件
     */
    onClick?: (e: MouseEvent, link: ILink) => void;
    /**
     * 自定义渲染
     */
    render?: (link: ILink, links: Array<ILink>, index: number) => JSX.Element | undefined;
    /**
     * props.children
     */
    children?: Array<ILink>;
    /**
     * 描述
     */
    desc?: string;
    /**
     * code
     */
    code?: string;
}

export interface IUserInfo {
    /**
    * 用户昵称
    */
    nickName?: string;
    /**
    * 头像地址
    */
    avatar?: string;
}

export interface HeaderProps {
    /**
     * react-router history
     * @defaultValue 默认为空，需要手动注入useHistory
     */
    history: any;
    /**
     * react-router location
     * @defaultValue 默认为空，需要手动注入useLocation
     */
    location: any;
    /**
     * logo地址
     */
    logo?: string | JSX.Element | null;
    /**
     * logo宽度
     */
    logoWidth?: string | number;
    /**
     * logo跳转链接
     */
    logoHref?: string;
    /**
     * 标题
     */
    title?: string | JSX.Element | null;
    /**
     * 对齐方式
     */
    align?: 'start' | 'end' | 'left' | 'right' | 'center' | 'justify' | 'match-parent';
    /**
     * 导航配置项
     */
    links?: Array<ILink>;
    /**
     * className
     */
    className?: string;
    /**
     * react style
     */
    style?: CSSProperties;
    /**
     * 点击链接时是否带上？后的参数
     * @defaultValue true
     */
    withParams?: boolean;
    /**
     * 用户信息展示
     */
    userInfo?: IUserInfo;
    /**
     * 是否固定
     * @defaultValue false
     */
    fixed?: boolean;
    /**
     * 额外渲染
     */
    extra?: JSX.Element | JSX.Element[] | string | null;
    /**
     * 统一配置item点击事件，优先级低，会被link.onClick覆盖
     */
    onItemClick?: (e: MouseEvent, link: ILink) => void;
};