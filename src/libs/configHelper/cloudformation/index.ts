
import type { AWS } from '@serverless/typescript';

export type CloudFormationTemplate = Exclude<AWS['resources'], undefined>;
