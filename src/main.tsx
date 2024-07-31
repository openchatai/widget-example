import ReactDOM from "react-dom/client";
import {
  useChat,
  WidgetRoot,
  ComponentRegistry,
  useConfigData,
  WidgetOptions,
  BotResponseWrapper,
  BotMessage,
} from "@openchatai/widget";
import { ComponentType, useMemo, useState } from "react";
import "./index.css";
import { SendHorizonalIcon } from "lucide-react";

export function UserMessage({
  children,
  user,
}: {
  children: React.ReactNode;
  user: WidgetOptions["user"];
}) {
  return (
    <div className="flex flex-row w-full gap-1 justify-end">
      <div className="wfit min-w-1/2">
        <div className="bg-slate-800 p-2.5 min-w-fit text-white rounded-lg leading-snug font-medium text-sm">
          {children}
        </div>
      </div>

      <div className="flex items-center gap-1">
        <span>{user?.name?.charAt(0)}</span>
      </div>
    </div>
  );
}

export function App() {
  const { state, sendMessage } = useChat();
  const [input, setInput] = useState("");
  const config = useConfigData();
  console.log(state.messages)
  const components = useMemo(
    () =>
      new ComponentRegistry({
        components: config.components,
      }),
    [config]
  );

  const LoadingComponent = components.getComponent(
    "loading",
    config.debug
  ) as ComponentType;

  return (
    <div className="w-screen h-screen min-h-screen bg-slate-100">
      <div className="container mx-auto h-full flex flex-col gap-1">
        <header className="p-4">
          <h2 className="text-lg font-bold">Header</h2>
        </header>
        <main className="p-4 flex-1">
          {state.messages.map((message, i) => {
            if (message.type === "FROM_USER") {
              return (
                <UserMessage key={i} user={config.user}>
                  {message.content}
                </UserMessage>
              );
            } else if (message.type === "FROM_BOT") {
              return (
                <BotResponseWrapper bot={message.bot}>
                  <BotMessage message={message} index={i} key={i} />
                </BotResponseWrapper>
              );
            }
            return null;
          })}
        </main>
        <footer className="p-4 relative">
          <div className="relative">
            <textarea
              value={input}
              className="w-full h-24 p-4 bg-slate-200 rounded-xl resize-none"
              onChange={(ev) => {
                setInput(ev.target.value);
              }}
            ></textarea>
            <div className="absolute right-0 bottom-0 p-2">
              <button
                className="rounded-lg bg-black text-white p-1"
                onClick={() => {
                  if (input.trim() === "") return;
                  sendMessage({
                    content: {
                      text: input,
                    },
                  });
                  setInput("");
                }}
              >
                <SendHorizonalIcon className="size-5" />
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

const token = "pQXK6zuZTSJc3iMD";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <WidgetRoot options={{ token, initialMessage: ["Hey!"], debug: true }}>
    <App />
  </WidgetRoot>
);
