import { Button, Input, Tooltip, Typography } from "@material-tailwind/react"
import { Fragment, useMemo, useRef, useState, type ChangeEvent, type ReactNode } from "react"
import { toast } from "sonner/dist"
import type { StateProxy } from "~hooks/binding"
import type { LLMTypes } from "~llms"
import createLLMProvider from "~llms"
import models from "~llms/models"
import PasswordInput from "~options/components/PasswordInput"
import Selector from "~options/components/Selector"

export type SettingSchema = {
    provider: LLMTypes

    // cloudflare settings
    accountId?: string
    apiToken?: string

    // if provider can select model
    model?: string
}

export const defaultSettings: Readonly<SettingSchema> = {
    provider: 'worker',
    model: '@cf/qwen/qwen1.5-14b-chat-awq'
}

export const title = 'AI 模型设定'

export const description = [
    '此设定区块包含了大语言模型(LLM)相关的设定，用于为插件提供 AI 功能。',
    '技术提供默认为公共的服务器，质量可能不稳定，建议设置为 Cloudflare 作为技术提供来源。'
]


function Hints({ children }: { children: ReactNode }): JSX.Element {
    return (
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
            {children}
        </Typography>
    )
}

function LLMSettings({ state, useHandler }: StateProxy<SettingSchema>): JSX.Element {

    const [validating, setValidating] = useState(false)
    const toastValidating = useRef<string | number>(null)
    const handler = useHandler<ChangeEvent<HTMLInputElement>, string>((e) => e.target.value)

    const selectableModels = useMemo(
        () => models
            .filter(({ providers }) => providers.includes(state.provider))
            .flatMap(({ models }) => models)
            .map(model => ({ label: model, value: model })),
        [state.provider]
    )

    const onSwitchProvider = (provider: LLMTypes) => {
        state.provider = provider
        state.model = undefined // reset model
        if (provider === 'webllm') {
            toast.info('使用 WEBLLM 时，请确保你的电脑拥有足够的算力以供 AI 运行。', { position: 'top-center' })
        }
    }

    const onValidate = async () => {
        setValidating(true)
        const provider = createLLMProvider(state)
        provider.on('progress', (p, t) => {
            if (toastValidating.current) {
                toast.loading(t, { id: toastValidating.current })
            }
        })
        const validation = provider.validate()
        toast.dismiss()
        toastValidating.current = toast.promise(validation, {
            loading: `正在验证配置...`,
            success: '配置可用！',
            error: err => '配置不可用: ' + (err.message ?? err),
            position: 'bottom-center',
            duration: Infinity,
            finally: () => setValidating(false)
        })

    }

    console.log('provider: ', state.provider)
    console.log('model: ', state.model)

    return (
        <Fragment>
            <Selector<typeof state.provider>
                className="col-span-2"
                data-testid="ai-provider"
                label="技术提供"
                value={state.provider}
                onChange={onSwitchProvider}
                options={[
                    { label: 'Cloudflare AI (云)', value: 'cloudflare' },
                    { label: '公共服务器 (云)', value: 'worker' },
                    { label: 'Chrome 浏览器内置 AI (本地)', value: 'nano' },
                    { label: 'Web LLM (本地)', value: 'webllm' }
                ]}
            />
            {state.provider === 'cloudflare' && (
                <Fragment>
                    <Hints>
                        <Typography className="underline" as="a" href="https://linux.do/t/topic/34037" target="_blank">点击此处</Typography>
                        查看如何获得 Cloudflare API Token 和 Account ID
                    </Hints>
                    <PasswordInput
                        data-testid="cf-account-id"
                        variant="static"
                        required
                        label="Cloudflare Account ID"
                        value={state.accountId}
                        onChange={handler('accountId')}
                    />
                    <PasswordInput
                        data-testid="cf-api-token"
                        variant="static"
                        required
                        label="Cloudflare API Token"
                        value={state.apiToken}
                        onChange={handler('apiToken')}
                    />
                </Fragment>
            )}
            {state.provider === 'nano' && (
                <Hints>
                    <Typography className="underline" as="a" href="https://juejin.cn/post/7401036139384143910" target="_blank">点击此处</Typography>
                    查看如何启用 Chrome 浏览器内置 AI
                </Hints>
            )}
            {selectableModels.length > 0 && (
                <Selector<string>
                    data-testid="ai-model"
                    label="模型提供"
                    value={state.model}
                    onChange={e => state.model = e}
                    options={selectableModels}
                    emptyValue="默认"
                />
            )}
            <div className="col-span-2">
                <Button disabled={validating} onClick={onValidate} color="blue" size="lg" className="group flex items-center justify-center gap-3 text-[1rem] hover:shadow-lg">
                    验证是否可用
                    <Tooltip content="检查你目前的配置是否可用。若不可用，则无法使用AI功能。" placement="top-end">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                        </svg>
                    </Tooltip>
                </Button>
            </div>
        </Fragment>
    )
}

export default LLMSettings