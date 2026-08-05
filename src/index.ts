/**
 * Task-progress plugin, node half. Pure UI plugin: the empty apply exists so
 * the plugin appears in the host cordis.yml / Loader; the browser half ships
 * via exports["./client"], discovered through the package.json dshClient
 * declaration. The report_progress tool itself is a separate host plugin
 * (demo/task-progress); this package only renders its tool rows.
 */

/** Host plugin body — no host-side behavior for this surface plugin. */
export function apply(): void {}
