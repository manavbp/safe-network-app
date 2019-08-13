/* eslint import/prefer-default-export: off */
import { ClientFunction } from 'testcafe';
import * as fs from 'fs-extra';

/* eslint no-undef: "off" */
export const getPageUrl = ClientFunction( () => window.location.href );
export const getPageTitle = ClientFunction( () => document.title );
