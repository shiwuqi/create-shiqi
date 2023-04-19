export interface SelectMenuProps {
    /**
     * 
     */
    options: any[];
    /**
     * 
     */
    onTitleClick?: (e: React.MouseEvent, item: any, url: string) => void;
};