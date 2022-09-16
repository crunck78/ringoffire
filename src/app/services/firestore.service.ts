import { Injectable } from '@angular/core';
import { addDoc, collection, Firestore, getDoc, doc, DocumentData, updateDoc, onSnapshot, DocumentSnapshot, FirestoreError } from '@angular/fire/firestore';
import { bindCallback, Observer } from 'rxjs';
import { Game } from 'src/models/game';

interface SnapChangeObserver {
  next?: (snapshot: DocumentSnapshot<DocumentData>) => void;
  error?: (error: FirestoreError) => void;
  complete?: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: Firestore) { }

  getCollectionRef(collectionName) {
    return collection(this.firestore, collectionName);
  }

  getDocumentRef(collectionName: string, documentId: string) {
    const collectionRef = this.getCollectionRef(collectionName);
    return doc(collectionRef, documentId);
  }

  getDocumentData(collectionName: string, documentId: string) {
    const documentRef = this.getDocumentRef(collectionName, documentId);
    return getDoc(documentRef)
      .then(doc => doc.data());
  }

  addDocToCollection(collectionName: string, document: DocumentData) {
    const collectionRef = this.getCollectionRef(collectionName);
    return addDoc(collectionRef, document.toJson());
  }

  updateDocToCollection(collectionName: string, documentId: string, updatedDocument: DocumentData) {
    const documentRef = this.getDocumentRef(collectionName, documentId);
    return updateDoc(documentRef, updatedDocument.toJson());
  }

  onValueChanges(collectionName: string, documentId: string, observer: SnapChangeObserver) {
    const documentRef = this.getDocumentRef(collectionName, documentId);
    return onSnapshot(documentRef, observer);
  }
}
