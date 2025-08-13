import { Alert, Button, Input, Tooltip, Typography } from "@material-tailwind/react"
import { Fragment, useRef, useState, type ChangeEvent, type ReactNode } from "react"
import { toast } from "sonner/dist"
import type { StateProxy } from "~hooks/binding"
import { useForceRender, useForceUpdate } from "~hooks/force-update"
import { usePromise } from "~hooks/promise"
import type { LLMTypes } from "~llms"
import createLLMProvider from "~llms"
import PasswordInput from "~options/components/PasswordInput"
import Selector from "~options/components/Selector"

export type SettingSchema = {
    provider: LLMTypes

    // cloudflare settings
    cf_accountId?: string
    cf_apiToken?: string

    // openai settings
    openai_baseUrl?: string
    openai_apiKey?: string

    // if provider can select model
    model?: string
}

export const defaultSettings: Readonly<SettingSchema> = {
    provider: 'cloudflare',
    model: '@cf/qwen/qwen1.5-14b-chat-awq',

    cf_accountId: '',
    cf_apiToken: '',
    openai_baseUrl: 'https://api.openai.com/v1',
    openai_apiKey: ''
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

    const [retryTrigger, retry] = useForceUpdate()

    const [models, error, loadingModels] = usePromise(
        async () => createLLMProvider(state).models(),
        [state.provider, retryTrigger]
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
                    { label: 'Chrome 浏览器内置 AI (本地)', value: 'nano' },
                    { label: 'Web LLM (本地)', value: 'webllm' },
                    { label: 'OpenAI 兼容节点 (云)', value: 'openai' }
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
                        value={state.cf_accountId}
                        onChange={handler('cf_accountId')}
                    />
                    <PasswordInput
                        data-testid="cf-api-token"
                        variant="static"
                        required
                        label="Cloudflare API Token"
                        value={state.cf_apiToken}
                        onChange={handler('cf_apiToken')}
                    />
                </Fragment>
            )}
            {state.provider === 'openai' && (
                <Fragment>
                    <Hints>
                        <Typography className="underline" as="a" href="https://platform.openai.com/docs/api-reference/authentication" target="_blank">点击此处</Typography>
                        查看如何获得 OpenAI API Key
                    </Hints>
                    <Input
                        data-testid="openai-base-url"
                        variant="static"
                        crossOrigin={'annoymous'}
                        label="OpenAI Base URL (可选)"
                        value={state.openai_baseUrl}
                        onChange={handler('openai_baseUrl')}
                    />
                    <PasswordInput
                        data-testid="openai-api-key"
                        variant="static"
                        required
                        label="OpenAI API Key"
                        value={state.openai_apiKey}
                        onChange={handler('openai_apiKey')}
                    />
                </Fragment>
            )}
            {state.provider === 'nano' && (
                <Hints>
                    <Typography className="underline" as="a" href="https://juejin.cn/post/7401036139384143910" target="_blank">点击此处</Typography>
                    查看如何启用 Chrome 浏览器内置 AI
                </Hints>
            )}
            {!loadingModels && !error && models?.length > 0 && (
                <Selector<string>
                    data-testid="ai-model"
                    label="模型提供"
                    value={state.model}
                    onChange={e => state.model = e}
                    options={models.map(m => ({ label: m, value: m }))}
                    emptyValue="默认"
                />
            )}
            {!loadingModels && error && (
                <Alert
                    className="col-span-2 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                    icon={
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="h-6 w-6 text-red-500"
                        >
                            <path
                                fillRule="evenodd"
                                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                                clipRule="evenodd"
                            />
                        </svg>
                    }
                    action={
                        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                            <Button
                                size="sm"
                                variant="outlined"
                                color="red"
                                className="flex items-center justify-center w-full gap-2 text-xs"
                                onClick={retry}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-4 h-4"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                                </svg>
                                重新获取
                            </Button>
                        </div>
                    }
                >
                    <div className="flex flex-col gap-1">
                        <Typography className="text-red-700 dark:text-red-300 font-medium text-sm">
                            获取模型列表失败
                        </Typography>
                        <Typography className="text-red-600 dark:text-red-400 text-xs opacity-90">
                            {error.message}
                        </Typography>
                    </div>
                </Alert>
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