import { Button, Input, List, Tooltip, Typography } from "@material-tailwind/react"
import { type ChangeEvent, Fragment, useState } from "react"
import { toast } from "sonner/dist"
import type { StateProxy } from "~hooks/binding"
import type { LLMProviders, LLMTypes } from "~llms"
import createLLMProvider from "~llms"
import ExperienmentFeatureIcon from "~options/components/ExperientmentFeatureIcon"
import Selector from "~options/components/Selector"
import SwitchListItem from "~options/components/SwitchListItem"



export type AISchema = {
    enabled: boolean
    provider: LLMTypes

    // cloudflare settings
    accountId?: string
    apiToken?: string
}


export const aiDefaultSettings: Readonly<AISchema> = {
    enabled: false,
    provider: 'worker'
}


function AIFragment({ state, useHandler }: StateProxy<AISchema>): JSX.Element {

    const [validating, setValidating] = useState(false)

    const handler = useHandler<ChangeEvent<HTMLInputElement>, string>((e) => e.target.value)
    const checker = useHandler<ChangeEvent<HTMLInputElement>, boolean>((e) => e.target.checked)

    const onValidate = async () => {
        setValidating(true)
        try {
            let provider: LLMProviders;
            if (state.provider === 'qwen') {
                provider = createLLMProvider(state.provider, state.accountId, state.apiToken)
            } else {
                provider = createLLMProvider(state.provider)
            }
            await provider.validate()
            toast.success('配置可用！')
        } catch (e) {
            toast.error('配置不可用: ' + e.message)
        } finally {
            setValidating(false)
        }
    }

    return (
        <Fragment>
            <List className="col-span-2 border border-[#808080] rounded-md">
                <SwitchListItem
                    data-testid="ai-enabled"
                    label="启用同传字幕AI总结"
                    hint="此功能将采用通义大模型对同传字幕进行总结"
                    value={state.enabled}
                    onChange={checker('enabled')}
                    marker={<ExperienmentFeatureIcon />}
                />
            </List>
            {state.enabled && (
                <Fragment>
                    <Selector<typeof state.provider>
                        className="col-span-2"
                        data-testid="ai-provider"
                        label="技术来源"
                        value={state.provider}
                        onChange={e => state.provider = e}
                        options={[
                            { label: 'Cloudflare AI', value: 'qwen' },
                            { label: '有限度服务器', value: 'worker' },
                            { label: 'Chrome 浏览器内置 AI', value: 'nano' }
                        ]}
                    />
                    {state.provider === 'qwen' && (
                        <Fragment>
                            <Typography
                                className="flex items-center gap-1 font-normal dark:text-gray-200 col-span-2"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="-mt-px h-6 w-6"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <Typography className="underline" as="a" href="https://linux.do/t/topic/34037" target="_blank">点击此处</Typography>
                                查看如何获得 Cloudflare API Token 和 Account ID
                            </Typography>
                            <Input
                                data-testid="cf-account-id"
                                crossOrigin="anonymous"
                                variant="static"
                                required
                                label="Cloudflare Account ID"
                                value={state.accountId}
                                onChange={handler('accountId')}
                            />
                            <Input
                                data-testid="cf-api-token"
                                crossOrigin="anonymous"
                                variant="static"
                                required
                                label="Cloudflare API Token"
                                value={state.apiToken}
                                onChange={handler('apiToken')}
                            />
                        </Fragment>
                    )}
                </Fragment>
            )}
            <div className="col-span-2">
                <Button disabled={validating} onClick={onValidate} color="blue" size="lg" className="group flex items-center justify-center gap-3 text-[1rem] hover:shadow-lg">
                    验证是否可用
                    <Tooltip content="检查你目前的配置是否可用。若不可用，则无法启用AI总结功能。" placement="top-end">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                        </svg>
                    </Tooltip>
                </Button>
            </div>
        </Fragment>
    )
}

export default AIFragment