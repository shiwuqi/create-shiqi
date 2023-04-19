import { FC, useState, useCallback } from 'react';
import { RightOutlined } from '@ant-design/icons';
import { SelectMenuProps } from './types';

import './index.css';

const SelectMenu: FC<SelectMenuProps> = (props) => {
    const { options, onTitleClick } = props;
    const [currentItem, setCurrentItem] = useState(options[0]);

    const handleMouseOver = useCallback((item: any) => {
        setCurrentItem(item);
    }, []);

    const renderRight = () => {
        if (currentItem && currentItem.children) {
            const { children } = currentItem;

            return (
                <div className='fan-select-menu-right'>
                    {
                        children.map((item: any, index: number) => {
                            if (item.children) {
                                return (
                                    <div className="fan-select-menu-right-col">
                                        <div className="fan-select-menu-right-item-title">{item.title}</div>
                                        <div>
                                            {
                                                item.children.map((child: any, childIndex: number) => {
                                                    return <div onClick={(e) => onTitleClick && onTitleClick(e, child, child.url)} className="fan-select-menu-right-item" key={childIndex}>
                                                        <span style={{ marginRight: 10 }}>{child.title}</span>
                                                        {
                                                            child.children ? child.children.map((subChild: any, subChildIndex: number) => {
                                                                return (
                                                                    <>
                                                                        <span onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            onTitleClick && onTitleClick(e, subChild, subChild.url);
                                                                        }} key={subChildIndex} className="fan-select-menu-right-item-desc">{subChild.title}</span>
                                                                        {subChildIndex !== child.children.length - 1 ? '、' : null}
                                                                    </>
                                                                )
                                                            }) : null
                                                        }
                                                    </div>;
                                                })
                                            }
                                        </div>
                                    </div>
                                );
                            } else {
                                return (
                                    <div className="fan-select-menu-right-col">
                                        <div onClick={(e) => onTitleClick && onTitleClick(e, item, item.url)} className="fan-select-menu-right-item" key={index}>
                                            <div>{item.title}</div>
                                            <div className="fan-select-menu-right-item-desc">{item.desc}</div>
                                        </div>
                                    </div>
                                );
                            }
                        })
                    }
                </div>
            );
        }
    }

    return (
        <div className="fan-select-menu">
            <div className="fan-select-menu-left">
                {
                    options.map((item: any, index: number) => {
                        return (
                            <div onClick={(e) => onTitleClick && onTitleClick(e, item, item.url)} onMouseOver={() => handleMouseOver(item)} className="fan-select-menu-item" key={index}>
                                {item.title}
                                {item.children ? <RightOutlined style={{ fontSize: 12 }} /> : null}
                            </div>
                        );
                    })
                }
            </div>
            {renderRight()}
        </div>
    );
}

export default SelectMenu;