import { expandGlob, type WalkEntry } from 'jsr:@std/fs';
import { relative } from 'jsr:@std/path';

const entries = [] as WalkEntry[];

for await (const entry of expandGlob('codes/typescript/chapter_*/*.ts')) {
    entries.push(entry);
}

const processes = [] as {
    status: Promise<Deno.CommandStatus>;
    stderr: ReadableStream<Uint8Array>;
}[];

for (const file of entries) {
    const execute = new Deno.Command('npm', {
        args: ['run', 'execute', relative(import.meta.dirname!, file.path)],
        cwd: import.meta.dirname,
        stdin: 'piped',
        stdout: 'piped',
        stderr: 'piped',
    });

    const process = execute.spawn();
    processes.push({ status: process.status, stderr: process.stderr });
}

const results = await Promise.all(
    processes.map(async (item) => {
        const status = await item.status;
        return { status, stderr: item.stderr };
    })
);

const errors = [] as ReadableStream<Uint8Array>[];

for (const result of results) {
    if (!result.status.success) {
        errors.push(result.stderr);
    }
}

console.log(`Tested ${entries.length} files`);
console.log(`Found exception in ${errors.length} files`);

if (errors.length) {
    console.log();

    for (const error of errors) {
        const reader = error.getReader();
        const { value } = await reader.read();
        const decoder = new TextDecoder();
        console.error(decoder.decode(value));
    }

    throw new Error('Test failed');
}