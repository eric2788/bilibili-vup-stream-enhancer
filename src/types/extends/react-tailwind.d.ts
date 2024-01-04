import type { dismiss } from '@material-tailwind/react/types/components/menu';

declare module '@material-tailwind/react/types/components/menu' {
    export interface dismiss {
        itemPress?: boolean;
        isRequired?: object;
    }
    export interface MenuProps {
        dismiss?: dismiss;
    }
}
