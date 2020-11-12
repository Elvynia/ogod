import { parent } from 'hybrids';

export const ogodFactoryParent = (category: string) => parent((hybrids: any) => hybrids.category === category);

export const ogodFactoryReactiveParent = (category: string, changesAction?: string, connect?) => {
    return {
        ...ogodFactoryParent(category),
        connect: (host, key, invalidate) => {
            host.state[key] = host[key].state;
            if (connect) {
                return connect(host, key, invalidate);
            }
        }
    }
}
