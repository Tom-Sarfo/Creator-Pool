# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e4]: "[plugin:vite:esbuild] Transform failed with 1 error: /Users/thomas/Creator Pool/app/routes/predictor-layout.tsx:141:16: ERROR: Unterminated regular expression"
  - generic [ref=e5]: /Users/thomas/Creator Pool/app/routes/predictor-layout.tsx:141:16
  - generic [ref=e6]: "Unterminated regular expression 139 | <SignedOut> 140 | <RedirectToSignIn /> 141 | </SignedOut> | ^ 142 | ); 143 | }"
  - generic [ref=e7]: at failureErrorWithLog (/Users/thomas/Creator Pool/node_modules/esbuild/lib/main.js:1467:15) at /Users/thomas/Creator Pool/node_modules/esbuild/lib/main.js:736:50 at responseCallbacks.<computed> (/Users/thomas/Creator Pool/node_modules/esbuild/lib/main.js:603:9) at handleIncomingPacket (/Users/thomas/Creator Pool/node_modules/esbuild/lib/main.js:658:12) at Socket.readFromStdout (/Users/thomas/Creator Pool/node_modules/esbuild/lib/main.js:581:7) at Socket.emit (node:events:524:28) at addChunk (node:internal/streams/readable:561:12) at readableAddChunkPushByteMode (node:internal/streams/readable:512:3) at Socket.Readable.push (node:internal/streams/readable:392:5) at Pipe.onStreamRead (node:internal/stream_base_commons:189:23) at Pipe.callbackTrampoline (node:internal/async_hooks:130:17)
  - generic [ref=e8]:
    - text: Click outside, press Esc key, or fix the code to dismiss.
    - text: You can also disable this overlay by setting
    - code [ref=e9]: server.hmr.overlay
    - text: to
    - code [ref=e10]: "false"
    - text: in
    - code [ref=e11]: vite.config.ts
    - text: .
```