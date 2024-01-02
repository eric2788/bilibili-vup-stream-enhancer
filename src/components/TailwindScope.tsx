
import styleText from 'data-text:~style.css'

function TailwindScope({ children, dark }: { children: React.ReactNode, dark?: boolean }) {
    return (
        <div className={dark === true ? `dark` : ''}>
            <style scoped>{styleText}</style>
            {children}
        </div>
    )
}

export default TailwindScope