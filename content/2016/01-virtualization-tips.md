Title: Mon mémo pour la virtualisation
Date: 2016-01-12 19:00
Tags: Virtualisation
Planet: false

Cet article est un mémo de toutes les commandes qui me sont régulièrement
utiles quand je manipule des machines virtuelles VirtualBox, VMware et KVM.
L'utilitaire **qemu-img** du paquet qemu-utils (sous Debian) a bien évolué et
c'est l'outil de prédilection pour les conversions ; on peut se passer de
l'utilitaire *VBoxManage* (qui fait partie de VirtualBox).

### Convertir une machine virtuelle VirtualBox en KVM 

La première approche c'est de créer une VM VirtualBox avec le type de disque
natif VDI et de convertir le disque au format QCOW2 avec *qemu-img* : 

    qemu-img convert -f vdi -O qcow2 vm-disk.vdi vm-disk.qcow2

Mais si la finalité c'est de mettre au point la VM sous VirtualBox avant de
l'installer sous KVM (dans un Proxmox par exemple), on peut plutôt créer une VM
VirtualBox directement avec le type de disque QEMU (QCOW) dans VirtualBox.

![VirtualBox](images/2016/virtualbox-creation.png "VirtualBox")

Ensuite, il reste à convertir le disque du format QCOW vers QCOW2 :

    qemu-img convert -O qcow2 vm-disk.qcow vm-disk.qcow2

### Convertir un disque VMware en VirtualBox

Le format natif des disques VMware est VMDK. L'utilitaire *VBoxManage* permet
de convertir un fichier VMDK en VDI.

    VBoxManage clonehd --format VDI vm-disk.vmdk vm-disk.vdi

Mais *qemu-img* reste la voie royale pour faire le même boulôt : 

    qemu-img convert -f vmdk -O vdi vm-disk.vmdk vm-disk.vdi

### Convertir une machine virtuelle VMware en KVM

D'abord exporter la machine au format OVF puis convertir le disque avec l'ami *qemu-img* :

    qemu-img convert -f vmdk -O qcow2 vm-disk.vmdk vm-disk.qcow2

Ensuite, on peut créer une VM avec des caractéristiques semblables dans KVM et
attacher le disque.

