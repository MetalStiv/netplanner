import React from "react";
import '../../styles/home/settings/index.scss';
import useLanguage from "../../common/customHooks/useLanguage";

const SettingsTab: React.FC = () => {
    const [language, languages, switchLanguage, langText] = useLanguage();

    return (
        <div id="settingsTab">
            <div className="main">
                <div className="first-row">
                    <div className="user-info-panel panel">
                        <div className="panel-data-container">
                            <div className="title">{langText.userPage.settingsTab.userInfo.title}</div>
                        </div>
                    </div>
                    <div className="user-balance-panel panel">
                        <div className="panel-data-container">
                            <div className="title">{langText.userPage.settingsTab.balance.title}</div>
                        </div>
                    </div>
                    <div className="user-general-settings-panel panel">
                        <div className="panel-data-container">
                            <div className="title">{langText.userPage.settingsTab.generalSettings.title}</div>
                            <div className="subtitle">{langText.userPage.settingsTab.generalSettings.subtitle}</div>
                            <div className="panel-row">
                                <div className="field-name">{langText.userPage.settingsTab.generalSettings.language+":"}</div>
                                <select value={language}>
                                {
                                    languages.map(l => <option onClick={e => switchLanguage(l)}>
                                        {l}
                                    </option>)
                                }
                                </select>
                                <div className="field-name">{langText.userPage.settingsTab.generalSettings.timezone+":"}</div>
                            </div>
                            <div className="panel-row">
                                <div className="field-name">{langText.userPage.settingsTab.generalSettings.password}</div>
                                <div className="change-link">{langText.userPage.settingsTab.generalSettings.change}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="second-row">
                    <div className="user-personal-rate-panel panel">
                        <div className="panel-data-container">
                            <div className="title">{langText.userPage.settingsTab.personalRate.title}</div>
                        </div>
                    </div>
                    <div className="sub-column">
                        <div className="user-organization-panel panel">
                            <div className="panel-data-container">
                                <div className="title">{langText.userPage.settingsTab.organization.title}</div>
                                <div className="subtitle">{langText.userPage.settingsTab.organization.subtitle}</div>
                            </div>
                        </div>
                        <div className="user-metrics-panel panel">
                            <div className="panel-data-container">
                                <div className="title">{langText.userPage.settingsTab.metrics.title}</div>
                                <div className="subtitle">{langText.userPage.settingsTab.metrics.subtitle}</div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>

    );
}
export default SettingsTab;