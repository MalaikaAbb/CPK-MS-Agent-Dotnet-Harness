// "Convert a custom catalog" (After) from /generative-ui/components/from-a2ui.
// The catalog is verbatim. The z import and the Airport / Arrow components, which
// the page never defines, are HARNESS-AUTHORED.
import { z } from "zod";
import {
  createGenerativeUI,
  standardUI,
} from "@copilotkit/react-core/v2/generative-ui";

// ── HARNESS-AUTHORED ──
function Airport({ code, city }: { code: string; city: string }) {
  return (
    <span className="inline-flex flex-col items-center px-2">
      <b>{code}</b>
      <small>{city}</small>
    </span>
  );
}
function Arrow() {
  return <span className="px-2">→</span>;
}

// ── doc snippet ──
export const appUI = createGenerativeUI({
  id: "acme/flights@1",
  extends: [standardUI],
  components: {
    Airport: {
      component: Airport,
      description: "An airport by IATA code, with its city under it.",
      props: z.object({ code: z.string(), city: z.string() }),
    },
    Arrow: { component: Arrow, description: "An arrow between two airports." },
  },
});
