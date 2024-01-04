import ShadowRoot from './ShadowRoot';
import styleText from 'data-text-env:~style.css';

function TailwindScope({ children, dark }: { children: React.ReactNode, dark?: boolean }): JSX.Element {
    return (
        <div className={dark === true ? `dark` : ''}>
            <ShadowRoot>
                <style>{styleText}</style>
                {children}
            </ShadowRoot>
        </div>
    )
}

export default TailwindScope