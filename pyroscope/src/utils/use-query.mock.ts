import { fn } from 'storybook/test';
import * as actual from './use-query';

export * from './use-query';
export const useLabelNames = fn(actual.useLabelNames).mockName('useLabelNames');
export const useLabelValues = fn(actual.useLabelValues).mockName('useLabelValues');
export const useServices = fn(actual.useServices).mockName('useServices');
