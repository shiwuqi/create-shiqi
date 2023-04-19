import { FC, MouseEvent } from 'react';
import { Affix, Dropdown } from 'antd';
import { UserOutlined, DownOutlined } from '@ant-design/icons';
import SelectMenu from '../selectMenu/index.js';
import { HeaderProps, ILink as LLink, IUserInfo as LUserInfo } from './types';

export interface ILink extends LLink { };
export interface IUserInfo extends LUserInfo { };

const Header: FC<HeaderProps> = (props) => {
    const {
        history,
        location,
        logo,
        title,
        align,
        links = [],
        className,
        style,
        withParams = true,
        userInfo,
        fixed = false,
        logoWidth,
        logoHref = "/",
        extra,
        onItemClick
    } = props;

    function renderLogo(): JSX.Element | undefined | null {
        if (typeof logo === "string") {
            return <div className="h-7">
                <a href={logoHref}><img className='h-full' alt="logo" src={logo} /></a>
            </div>
        } else {
            return logo;
        }
    }

    function renderTitle(): JSX.Element | undefined | null {
        if (typeof title === "string") {
            // font - weight: 400;
            // font - size: 16px;
            // margin - left: 10px;
            // font - weight: bold;
            return <div className="font-medium text-base ml-2.5">{title}</div>
        } else {
            return title
        }
    }

    function renderLinks(): JSX.Element | any[] {
        return links.map((each, index) => {

            if (each.render) {
                return each.render(each, links, index)
            }

            if (each.children) {
                return (
                    <Dropdown key={index} overlay={<SelectMenu onTitleClick={handleLinkClick} options={each.children} />}>
                        {/* border-bottom: 2px solid var(--ant-primary-color); */}
                        <div
                            onClick={(e) => handleLinkClick(e, each, each.url)}
                            style={{ ...each.style }}
                            // className={renderActive(each) ? `fan-active fan-link ${each.className}` : `fan-link ${each.className}`}
                            className={`${renderActive(each) ? 'text-primary border-2 border-solid border-primary' : ''} no-underline text-neutral-800 mr-10 text-sm h-full flex items-center cursor-pointer hover:text-primary ${each.className}`}
                        >
                            {each.title}
                            {/* position: relative;
                            left: 5px;
                            font-size: 14px !important; */}
                            <DownOutlined className='relative left-1 text-sm' />
                        </div>
                    </Dropdown>
                );
            }

            return <span key={index}
                onClick={(e) => handleLinkClick(e, each, each.url)}
                style={{ ...each.style }}
                // className={renderActive(each) ? `fan-active fan-link ${each.className}` : `fan-link ${each.className}`}
                className={`${renderActive(each) ? 'text-primary border-2 border-solid border-primary' : ''} no-underline text-neutral-800 mr-10 text-sm h-full flex items-center cursor-pointer hover:text-primary ${each.className}`}
            >
                {each.title}
            </span>
        })
    }

    function renderActive(each: ILink) {
        const { hash, pathname } = location
        if (hash) {
            if (each.url === "/") {
                if (hash === "#/" || hash === "#/?" || hash.indexOf("#/?") >= 0) {
                    return true
                } else if (each.match) {
                    return hash.includes(each.match)
                } else {
                    return false
                }
            } else {
                return hash.includes(each.match ? each.match : each.url)
            }
        } else {
            if (each.match) {
                return pathname.includes(each.match)
            }

            return pathname === each.url
        }
    }

    function renderUserInfo(): JSX.Element | undefined {
        if (userInfo) {
            return <div className='flex items-center'>
                {userInfo.avatar ? <img src={userInfo.avatar} alt='avatar' className='w-8 h-8 overflow-hidden rounded-2.5xl' /> : null}
                {userInfo.nickName ? <><UserOutlined /><div className='ml-1.5 font-normal inline-block'>{userInfo.nickName}</div></> : null}
            </div>
        }
    }

    function handleLinkClick(e: MouseEvent, link: ILink, url: string): undefined {
        if (!url) {
            return;
        }
        // 优先级最高
        if (link.onClick) {
            link.onClick(e, link)
            return
        }

        // 优先级次之
        if (onItemClick) {
            onItemClick(e, link)
            return
        }

        const { prefix } = link;

        let _url = url;
        if (prefix) {
            _url = `${prefix}${_url}`;
        }

        if (withParams) {
            let _href = window.location.href
            let strIndex = _href.indexOf("?")
            if (strIndex !== -1) {
                let str = _href.substring(strIndex)
                _url = `${_url}${str}`
            }
        }

        if (_url && _url.indexOf("http") >= 0) {
            let otherLink = document.createElement('a')
            otherLink.href = _url
            otherLink.target = "_blank"
            // 触发点击事件执行下载
            otherLink.click()
        } else {
            const { hash, pathname, origin } = window.location;
            let prefix = origin;
            if (hash) {
                prefix = `${prefix}${pathname}#`;
            }

            if (history && typeof history === "function") {
                // history(_url);
                window.location.href = `${prefix}${_url}`;
            } else {
                // history?.push(_url);
                window.location.href = `${prefix}${_url}`;
            }
        }
    }

    if (fixed) {
        return (
            <Affix offsetTop={0} style={{ zIndex: 20 }}>
                <div className={`relative h-14 bg-white px-5 flex items-center transition-all duration-75 shadow-smd text-666 z-999 ${className}`} style={style}>
                    <div className="flex items-center" style={{ width: logoWidth }}>
                        {renderLogo()}
                    </div>
                    {renderTitle()}
                    <div className={`flex-1 ml-32 h-full flex items-center text-${align}`}>
                        {renderLinks()}
                    </div>
                    {renderUserInfo()}
                    {extra && extra}
                </div>
            </Affix>
        );
    }

    return (
        <div className={`relative h-14 bg-white px-5 flex items-center transition-all duration-75 shadow-smd text-666 z-999 ${className}`} style={style}>
            <div className="flex items-center" style={{ width: logoWidth }}>
                {renderLogo()}
            </div>
            {renderTitle()}
            <div className={`flex-1 ml-4 h-full flex items-center text-${align}`}>
                {renderLinks()}
            </div>
            {renderUserInfo()}
            {extra && extra}
        </div>
    );
}

export default Header;