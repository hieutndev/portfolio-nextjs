"use client"

import { MDXEditorMethods, MDXEditorProps } from "@mdxeditor/editor";
import dynamic from "next/dynamic";
import { forwardRef, useEffect, useState } from "react";
import { Accordion, AccordionItem, addToast, Input, Button } from "@heroui/react";

import InitMDXEditor from "@/components/shared/mdx-editor/mdx-init-html";
import CustomForm from "@/components/shared/forms/custom-form";
import Container from "@/components/shared/container/container";
import { useFetch } from "hieutndev-toolkit";
import API_ROUTE from "@/configs/api";
import { IAPIResponse } from "@/types/global";
import { TSetting } from "@/types/settings";
import { MAP_MESSAGE } from "@/configs/response-message";
import ICON_CONFIG from "@/configs/icons";
import AnimatedQuote from "@/components/pages/introduce/animated-quote";


const SkillSections = [
    { key: "techstacks" as keyof TSetting["skills"], label: "Techstacks", placeholder: "Insert your tech stack icon URL here (get it on devicon.dev)" },
    { key: "development_tools" as keyof TSetting["skills"], label: "Development tools", placeholder: "Insert development tool icon URL here" },
    { key: "design_tools" as keyof TSetting["skills"], label: "Design tools", placeholder: "Insert design tool icon URL here" },
]

const Editor = dynamic(() => import("@/components/shared/mdx-editor/mdx-editor-initialized"), {
    ssr: false,
    loading: () => <InitMDXEditor />
});

const ForwardRefEditor = forwardRef<
    MDXEditorMethods,
    MDXEditorProps & { onEditorReady?: () => void; imageUploadHandler?: (file: File) => Promise<string>; }
>((props, ref) => {

    const { onEditorReady, imageUploadHandler, ...editorProps } = props;

    useEffect(() => {
        const timer = setTimeout(() => {
            onEditorReady?.();
        }, 100);

        return () => clearTimeout(timer);
    }, [onEditorReady]);

    return (
        <Editor
            {...editorProps}
            editorRef={ref}
            imageUploadHandler={imageUploadHandler}
        />
    );
});

ForwardRefEditor.displayName = "ForwardRefEditor";

export default function ContentComponent() {

    /* HANDLE GET ALL SETTINGS */

    const { data: fetchSettingResults, loading: fetchingSettings, error: fetchSettingsError, fetch: fetchSettings } = useFetch<IAPIResponse<TSetting>>(API_ROUTE.SETTINGS.GET_SETTINGS);

    useEffect(() => {
        if (fetchSettingResults && fetchSettingResults.results) {
            setSettings(fetchSettingResults.results);
        }

        if (fetchSettingsError) {
            const parseError = JSON.parse(fetchSettingsError);

            if (parseError.message) {
                addToast({
                    title: "Error",
                    description: MAP_MESSAGE[parseError.message] || parseError.message,
                    color: "danger",
                });
            }
        }
    }, [fetchSettingResults, fetchSettingsError]);

    /* HANDLE UPDATE SETTING */

    const { data: updateSettingResult, loading: updatingSetting, error: updateSettingError, fetch: updateSetting } = useFetch(API_ROUTE.SETTINGS.UPDATE_SETTINGS, {
        method: "POST",
        skip: true,
    })

    const submitUpdate = () => {
        updateSetting({
            body: {
                ...settings,
                skills: JSON.stringify(settings.skills),
            }
        });
    }

    useEffect(() => {
        if (updateSettingResult) {
            addToast({
                title: "Success",
                description: MAP_MESSAGE[updateSettingResult.message] || updateSettingResult.message,
                color: "success",
            });
            fetchSettings();

        }

        if (updateSettingError) {
            const parseError = JSON.parse(updateSettingError);

            if (parseError.message) {
                addToast({
                    title: "Error",
                    description: MAP_MESSAGE[parseError.message] || parseError.message,
                    color: "danger",
                });
            }
        }
    }, [updateSettingResult, updateSettingError]);

    const [settings, setSettings] = useState<TSetting>({
        introduce: "",
        animated_quote: "",
        skills: {
            techstacks: [],
            development_tools: [],
            design_tools: []
        },
    });


    const handleAddSkill = (key: keyof TSetting["skills"]) => {
        setSettings((prev) => ({
            ...prev,
            skills: {
                ...prev.skills,
                [key]: [...(prev.skills[key] ?? []), ""],
            },
        }));
    };

    const handleRemoveSkill = (key: keyof TSetting["skills"], index: number) => {
        setSettings((prev) => {
            const next = [...(prev.skills[key] ?? [])];

            next.splice(index, 1);

            return {
                ...prev,
                skills: {
                    ...prev.skills,
                    [key]: next,
                },
            };
        });
    };

    const handleUpdateSkill = (key: keyof TSetting["skills"], index: number, value: string) => {
        setSettings((prev) => {
            const next = [...(prev.skills[key] ?? [])];

            next[index] = value;

            return {
                ...prev,
                skills: {
                    ...prev.skills,
                    [key]: next,
                },
            };
        });
    };



    return (
        <CustomForm
            className={"w-full flex flex-col gap-4"}
            formId={"introduce-section-form"}
            isLoading={updatingSetting}
            loadingText={"Updating Introduce..."}
            submitButtonSize={"md"}
            useCtrlSKey={true}
            onSubmit={() => submitUpdate()}
        >
            <Accordion
                className={"w-full"}
                defaultSelectedKeys={["introduce-section"]}
                variant={"shadow"}
            >
                <AccordionItem
                    key={"introduce-section"}
                    keepContentMounted
                    subtitle={"Manage introduce section content"}
                    title={<h4 className={"text-xl font-semibold"}>Introduce Sections</h4>}
                >
                    <div className="border border-default-200 rounded-lg overflow-hidden bg-white shadow-sm">
                        <ForwardRefEditor
                            markdown={settings.introduce}
                            onChange={(value) => setSettings((prev) => ({ ...prev, introduce: value }))}
                        />
                    </div>
                    <div className={"flex flex-col gap-1"}>
                        <small className="text-gray-500">* Markdown formatting is supported. <a className="italic underline" href="https://www.markdownguide.org/basic-syntax/" rel="noreferrer" target="_blank">See quick guide</a> to get started.</small>
                    </div>
                </AccordionItem>
                <AccordionItem
                    key={"animated-quote-section"}
                    keepContentMounted
                    subtitle={"Manage animated quote content"}
                    title={<h4 className={"text-xl font-semibold"}>Animated Quote Section</h4>}
                >
                    <div className={"flex flex-col gap-4"}>
                        <Input value={settings.animated_quote} onValueChange={(value) => setSettings((prev) => ({ ...prev, animated_quote: value }))} />
                        <AnimatedQuote renderText={settings.animated_quote} />
                    </div>
                </AccordionItem>
                <AccordionItem
                    key={"skill-section"}
                    keepContentMounted
                    subtitle={"Manage skill section content"}
                    title={<h4 className={"text-xl font-semibold"}>Skill Sections</h4>}
                >
                    <div className={"flex flex-col gap-4"}>
                        {SkillSections.map((section) => (
                            <div key={section.key} className={"flex flex-col gap-2"}>
                                <div className={"w-full flex items-center justify-start gap-2"}>
                                    <h6 className={"text-lg font-medium"}>{section.label}</h6>
                                    <Button isIconOnly color={"primary"} size={"sm"} variant={"flat"} onClick={() => handleAddSkill(section.key)}>{ICON_CONFIG.NEW}</Button>
                                </div>

                                <div className={"flex flex-col gap-2"}>
                                    {(settings.skills[section.key] ?? []).map((item, idx) => (
                                        <div key={idx} className={"flex items-center justify-start gap-2"}>
                                            <Input
                                                placeholder={section.placeholder}
                                                value={item}
                                                variant={"bordered"}
                                                onChange={(e: any) => handleUpdateSkill(section.key, idx, e.target?.value ?? "")}
                                            />
                                            <Button isIconOnly color={"danger"} variant={"flat"} onClick={() => handleRemoveSkill(section.key, idx)}>{ICON_CONFIG.DELETE}</Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </AccordionItem>
            </Accordion>
        </CustomForm>
    );
}