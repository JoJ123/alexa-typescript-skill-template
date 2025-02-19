import { LambdaHandler } from "ask-sdk-core/dist/skill/factory/BaseSkillFactory";
import { RequestEnvelope } from "ask-sdk-model";
import * as bodyParser from "body-parser";
import * as express from "express";
import { AddressInfo } from "net";

import { handler } from "../custom";

function CreateHandler(handlerInput: LambdaHandler): express.RequestHandler {
  return (req, res) => {
    handlerInput(req.body as RequestEnvelope, null, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      return res.status(200).json(result);
    });
  };
}

// create server
const server = express();
const listener = server.listen(process.env.port || process.env.PORT || 3980, () => {
  const { address, port } = listener.address() as AddressInfo;
  // tslint:disable-next-line
  console.log("%s listening to %s%s", server.name, address, port);
});

// parse json
server.use(bodyParser.json());

// connect the lambda functions to http
server.post("/", CreateHandler(handler));
