import { IconButton, Tooltip } from "@material-tailwind/react";

function FooterButton({ children, title, onClick }: { children: React.ReactNode, title: string, onClick?: VoidFunction }): JSX.Element {
  return (
    <Tooltip content={title} placement="bottom">
      <IconButton onClick={onClick} variant="text" size="lg" title={title} className="rounded-full shadow-md bg-white">
        {children}
      </IconButton>
    </Tooltip>
  )
}

export default FooterButton