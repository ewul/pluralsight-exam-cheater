import { VersionConfiguration } from './beans';
import { getVersionConfiguration } from './mongodb';

const version: string = '1.1';

export const versionCheck = async () => {
    let config:VersionConfiguration = await getVersionConfiguration();
    if (config.data.minValidVersion > version) {
        return false;
    }
    else if(config.data.currentVersion > version) {
        return config.data.currentVersion;
    }
    else{
        return true;
    }
}