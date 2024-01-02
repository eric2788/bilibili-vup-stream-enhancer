
import styled from '@emotion/styled'
import styleText from 'data-text:~style.css'

const TailwindStyle = styled.div`${styleText}`

function TailwindScope({ children, dark }: { children: React.ReactNode, dark?: boolean }) {
    return (
        <div className={dark === true ? `dark` : ''}>
            <TailwindStyle>
                {children}
            </TailwindStyle>
        </div>
    )
}

export default TailwindScope