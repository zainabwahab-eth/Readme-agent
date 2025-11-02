import { registerApiRoute } from "@mastra/core/server";
import { randomUUID } from "crypto";

export const a2aAgentRoute = registerApiRoute("/a2a/agent/:agentId", {
  method: "POST",
  handler: async (c) => {
    try {
      const mastra = c.get("mastra");
      const agentId = c.req.param("agentId");
      const body = await c.req.json();

      const { jsonrpc, id: requestId, method, params } = body;

      // Validate JSON-RPC
      if (jsonrpc !== "2.0" || !requestId) {
        return c.json(
          {
            jsonrpc: "2.0",
            id: requestId || null,
            error: { code: -32600, message: "Invalid Request" },
          },
          400
        );
      }

      const agent = mastra.getAgent(agentId);
      if (!agent) {
        return c.json(
          {
            jsonrpc: "2.0",
            id: requestId,
            error: { code: -32602, message: `Agent '${agentId}' not found` },
          },
          404
        );
      }

      const { message, messages = [] } = params || {};
      const inputMessages = message ? [message] : messages;

      // Convert A2A → Mastra format
      const mastraMessages = inputMessages.map((msg: any) => ({
        role: msg.role,
        content:
          msg.parts
            ?.map((p: any) => p.text || JSON.stringify(p.data))
            .join("\n") || "",
      }));

      // Run agent
      const response = await agent.generate(mastraMessages);
      const text = response.text || "";

      // Build A2A response
      return c.json({
        jsonrpc: "2.0",
        id: requestId,
        result: {
          id: randomUUID(),
          contextId: randomUUID(),
          status: { state: "completed", timestamp: new Date().toISOString() },
          artifacts: [
            {
              artifactId: randomUUID(),
              name: "Response",
              parts: [{ kind: "text", text }],
            },
          ],
          history: [
            ...inputMessages.map((m: any) => ({
              ...m,
              messageId: randomUUID(),
            })),
            {
              role: "agent",
              parts: [{ kind: "text", text }],
              messageId: randomUUID(),
            },
          ],
          kind: "task",
        },
      });
    } catch (error: any) {
      return c.json(
        {
          jsonrpc: "2.0",
          id: null,
          error: { code: -32603, message: error.message },
        },
        500
      );
    }
  },
});
