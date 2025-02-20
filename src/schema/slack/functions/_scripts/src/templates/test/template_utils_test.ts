import {
  autogeneratedComment,
  getFunctionName,
  getSlackCallbackId,
  renderFunctionImport,
  renderTypeImports,
} from "../template_utils.ts";
import {
  assertEquals,
  assertStringIncludes,
} from "../../../../../../../dev_deps.ts";
import { FunctionRecord } from "../../types.ts";
import SchemaTypes from "../../../../../../schema_types.ts";
import SlackTypes from "../../../../../schema_types.ts";
import { InternalSlackTypes } from "../../../../../types/custom/mod.ts";

const DESCRIPTION = "Test the built-in function template";
const TITLE = "test function";
const CALLBACK_ID = "test_function";

Deno.test("Autogenerated comment should contain readme location", () => {
  const actual = autogeneratedComment();
  assertStringIncludes(actual, "src/schema/slack/functions/README.md");
});

Deno.test("Function name should be pascal case", () => {
  const actual = getFunctionName(CALLBACK_ID);
  assertEquals(actual, "TestFunction");
});

Deno.test("Function import should contain file path", () => {
  const actual = renderFunctionImport(CALLBACK_ID);
  assertStringIncludes(actual, `./${CALLBACK_ID}.ts`);
});

Deno.test("getSlackCallbackId should generate the valid slack callback_id", () => {
  const actual = `slack#/functions/${CALLBACK_ID}`;
  const expected = getSlackCallbackId({
    callback_id: CALLBACK_ID,
    title: TITLE,
    description: DESCRIPTION,
    type: "builtin",
    input_parameters: [],
    output_parameters: [],
  });
  assertStringIncludes(actual, expected);
});

Deno.test("renderTypeImports should render all imports provided", () => {
  const dfi: FunctionRecord = {
    callback_id: CALLBACK_ID,
    title: TITLE,
    description: DESCRIPTION,
    type: "builtin",
    input_parameters: [
      {
        type: SlackTypes.channel_id,
        name: "channel_id",
        title: "Select a channel",
        is_required: true,
        description: "Search all channels",
      },
      {
        type: InternalSlackTypes.form_input_object.id,
        name: "fields",
        title: "fields",
        is_required: true,
        description: "Input fields to be shown on the form",
      },
    ],
    output_parameters: [
      {
        type: SchemaTypes.string,
        name: "message_ts",
        title: "Message time stamp",
        description: "Message time stamp",
      },
      {
        type: SchemaTypes.array,
        name: "user_ids",
        title: "User Ids",
        description: "User Ids",
        items: {
          type: "integer",
        },
      },
    ],
  };
  const actual = renderTypeImports(dfi);
  assertStringIncludes(actual, "SchemaTypes");
  assertStringIncludes(actual, "SlackTypes");
  assertStringIncludes(actual, "InternalSlackTypes");
});
