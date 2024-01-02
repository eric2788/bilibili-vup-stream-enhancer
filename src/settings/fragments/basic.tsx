

export type SettingSchema = {
    regex: string
    opacity: number
    color: ''
    danmakuPosition: 'top' | 'bottom' | 'unchanged'
}


export const defaultSettings: Readonly<SettingSchema> = {
    regex: '^(?<n>[^【】]+?)?\\:?\\s*【(?<cc>[^【】]+?)(】.?)?$',
    opacity: -1,
    color: '',
    danmakuPosition: 'unchanged'
}

// TODO: change to use tailwindcss
export default function BasicSettings({settings}: SettingProp<SettingSchema>): JSX.Element {
    return (
        <>
            <div className="form-group">
                <label htmlFor="reg-cap">过滤使用的正则表达式</label>
                <input type="text" className="form-control" id="reg-cap" aria-describedby="reg-help" defaultValue={settings.regex} />
                <small id="reg-help" className="form-text text-muted">有关正则表达式可以到<a href="https://regex101.com">这里</a>进行测试。</small>
                <small id="reg-help" className="form-text text-muted">必须包含名称为cc的正则组别以捕捉字幕。</small>
                <small id="reg-help" className="form-text text-muted">可包含名称为n的正则组别以捕捉说话者。</small>
            </div>
            <div className="card mb-3">
                <div className="card-header">
                    <a href="#tongchuan" data-toggle="collapse">➵ 同传弹幕设定</a>
                </div>
                <div className="form-group collapse" id="tongchuan">
                    <div className="card-body">
                        <div className="form-group">
                            <label htmlFor="opacity-jimaku">同传弹幕透明度</label>
                            <input type="number" className="form-control" id="opacity-jimaku" aria-describedby="opacity-help" max="100" min="-1" defaultValue={settings.opacity} />
                            <small id="opacity-help" className="form-text text-muted">范围 0 ~ 100, -1 代表不改变。</small>
                        </div>

                        <div className="form-group">
                            <label htmlFor="color-jimaku">同传弹幕颜色</label>
                            <div className="input-group">
                                <input type="text" className="form-control" id="color-jimaku" aria-describedby="color-help" pattern="^#[0-9A-Fa-f]{6}$" title="#FFFFFF" defaultValue={settings.color} />
                                <div className="input-group-append">
                                    <span className="input-group-text">
                                        <input type="color" className="color-picker" id="color-jimaku-picker" />
                                    </span>
                                </div>
                            </div>
                            <small id="color-help" className="form-text text-muted">格式 #FFFFFF, 留空不改变。</small>
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="danmaku-position">弹幕位置</label>
                            <select className="custom-select" id="danmaku-position" defaultValue={settings.danmakuPosition}>
                                <option value="unchanged">不改变</option>
                                <option value="top">置顶</option>
                                <option value="bottom">置底</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}