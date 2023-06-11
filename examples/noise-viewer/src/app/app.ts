import { AppSources } from "./state";

export function main(sources: AppSources) {
    return {
        Worker: sources.Element,
        Element: sources.Worker.input$
    };
}
