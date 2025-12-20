import { ApiKey } from "./token.service.js";
import env, {filePath} from "../../../config.js";
const apikey = new ApiKey(filePath, env.SALT.toString())

await apikey.generate()
