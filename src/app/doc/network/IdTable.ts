interface IdCollaborator {
    networkId: number
    muteCoreId: number
}

export class IdTable {
    private idTable: Array<IdCollaborator>  // Table de correspondance des id

    constructor() {
        this.idTable = new Array()
    }

    /**
     * Ajoute un nouveau couple d'id permettant d'identifier un pair
     * @param networkId number
     * @param muteCoreId number
     */
    public addNewValue(networkId: number, muteCoreId: number) {
        if(this.getIndexOf(muteCoreId) !== -1) {
            this.setNetworkId(muteCoreId, networkId)
        } else {
            this.idTable.push({networkId: networkId, muteCoreId: muteCoreId})
        }

        console.log("==== IdTable --- état de la table ---- taille de la table : " + this.idTable.length + "==== ")
        this.idTable.forEach(couple => {
            console.log("==== Couple de la table : {" + couple.networkId + ", " + couple.muteCoreId + "} =====")
        })
    }
 
    /**
     * Retire un couple {networkId, muteCoreId} à partir d'un muteCoreId
     * @param muteCoreId identifiant muteCore du pair à retirer de la liste
     */
    public removeCoupleByMuteCoreId(muteCoreId: number) {
        let tmpTable: Array<IdCollaborator> = new Array()
        this.idTable.forEach(couple => {
            if(couple.muteCoreId !== muteCoreId) {
                tmpTable.push(couple)
            }
        })
        this.idTable = tmpTable
    }

    /**
     * Retire un couple {networkId, muteCoreId} à partir d'un networkId
     * @param networkId identifiant muteCore du pair à retirer de la liste
     */
    public removeCoupleByNetworkId(networkId: number) {
        let tmpTable: Array<IdCollaborator> = new Array()
        this.idTable.forEach(couple => {
            if(couple.networkId !== networkId) {
                tmpTable.push(couple)
            }
        })
        this.idTable = tmpTable
    }

    /**
     * Retourne l'identifiant networkId correspondant au pair avec pour muteCoreId le paramètre
     * @param muteCoreId 
     */
    public getNetworkId(muteCoreId: number): number {
        let result: number = 0
        let i: number = 0
        let find: boolean = false
        while(this.idTable[i] !== undefined && !find) {
            if(this.idTable[i].muteCoreId === muteCoreId) {
                result = this.idTable[i].networkId
                find = true
            }
            i++
        }
        return result
    }

    /**
     * Retourne l'identifiant muteCoreId correspondant au pair avec pour networkId le paramètre
     * @param networkId 
     */
    public getMuteCoreId(networkId: number): number {
        let result: number = 0
        let i: number = 0
        let find: boolean = false
        while(this.idTable[i] !== undefined && !find) {
            if(this.idTable[i].networkId === networkId) {
                result = this.idTable[i].muteCoreId
                find = true
            }
            i++
        }
        return result
    }

    /**
     * Remplace la valeur de networkId d'un pair par une nouvelle
     * @param muteCoreId du pair auquel il faut modifier le networkId
     * @param newNetworkId nouvelle valeur de networkId
     */
    setNetworkId(muteCoreId: number, newNetworkId: number) {
        let index = this.getIndexOf(muteCoreId)
        if(index !== -1) {
            this.idTable[index].networkId = newNetworkId
        }
    }

    /**
     * Retourne l'index du couple ayant pour muteCoreId le param (-1 s'il n'existe pas)
     * @param muteCoreId number
     */
    getIndexOf(muteCoreId: number): number {
        let res: number = -1
        let i: number = 0
        while(this.idTable[i] !== undefined && res === -1) {
            if(this.idTable[i].muteCoreId === muteCoreId) {
                res = i
            }
            i++
        }
        return res
    }
}