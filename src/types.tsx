

export type Produto = {
    id?: number;
    nome: string;
    descricao: string;
    categoria: string;
    quantidadeEstoque: number;
    precoDeCusto: number;
    precoDeVenda: number;
  };
  
  export type Comanda = {
    id: number;
    cliente: string;
    produtos: Produto[];
  };

  export interface ProdutoDTO {
    id?: number; 
    nome: string;
    descricao: string;
    categoria: string;
    quantidadeEstoque: number;
    precoDeCusto: number;
    precoDeVenda: number;
    caminhoImagem?: string;
  }
  
  