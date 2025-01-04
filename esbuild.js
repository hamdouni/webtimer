import * as esbuild from 'esbuild';
import sveltePlugin from 'esbuild-svelte';
const isDev = process.argv.includes('--dev')

let options = {
    entryPoints: ['app.svelte'],
    bundle: true,
    format: 'esm',
    outdir: './build',
    plugins: [
        sveltePlugin({
            compilerOptions: { customElement: true}
        })
    ],
};

// Not dev mode : build for production and exit
if (!isDev) {
	await esbuild.build({
		...options,
		logLevel: 'error',
		minify: true,
		sourcemap: false,
	});
	process.exit(0);
}


// Dev mode : add logs, watch files, serve on localhost
let devOptions = {
	...options,
    banner: {
        js: "new EventSource('http://127.0.0.1:8888/esbuild').addEventListener('change', () => location.reload())"
    },
    logLevel: 'info',
	minify: false,
	sourcemap: true,
}
let ctx = await esbuild.context(devOptions);
await ctx.watch();
await ctx.serve({
    servedir: './',
    port: 8888,
    host: '127.0.0.1'
});
