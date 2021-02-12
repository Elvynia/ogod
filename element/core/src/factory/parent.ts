import { parent } from 'hybrids';

export const ogodFactoryParent = (category: string) => parent((hybrids: any) => hybrids.category === category);

// FIXME: handle changes
export const ogodFactoryReactiveParent = (category: string, changesAction?: string, connect?) => {
    return {
        ...ogodFactoryParent(category),
        connect: (host, key, invalidate) => {
            const disconnect = connect && connect(host, key, invalidate);
            host.state[key] = host[key].state;
            return () => disconnect && disconnect();
        }
    }
}
