import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import typescript2 from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import autoExternal from "rollup-plugin-auto-external";
import dts from "rollup-plugin-dts";

export default [
    {
        input: "src/index.ts",
        output: [
            {
                file: "es/index.js",
                name: "@shiqi/sdk",
                format: "esm"
            },
            {
                file: "lib/index.js",
                name: "@shiqi/sdk",
                format: "cjs"
            }
        ],
        plugins: [
            commonjs({
                include: /node_modules/
            }),
            json(),
            // typescript2({
            //     sourceMap: false
            // }),
            resolve(),
            babel({
                exclude: "node_modules/**"
            }),
            terser(),
            autoExternal()
        ],
        external: [],
    },
    {
        input: 'src/index.ts',
        output: {
            file: "./types/index.d.ts",
            format: "es"
        },
        plugins: [dts()],
    }
];