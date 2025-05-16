import dotenv from 'dotenv';
import { connectToDatabase } from '../mongoose-connection';
import { RegistrationModel } from '../../shared/models/registration.model';
import { Parser } from 'json2csv';

dotenv.config();

module.exports = async (req: any, res: any) => {
  await connectToDatabase();

  try {
    const registrations = await RegistrationModel.find({}).lean();

    const flatRegistrations = registrations.map((r: any) => ({
      childName: r.childName,
      birthDate: r.birthDate,
      age: r.age,
      gender: r.gender,
      identityDocument: r.identityDocument,
      address: r.address,
      churchMembership: r.churchMembership,
      churchName: r.churchName,
      healthInsurance: r.healthInsurance,
      medications: r.medications,
      allergies: r.allergies,
      specialNeeds: r.specialNeeds,
      responsibleName: r.responsibleInfo?.name,
      responsiblePhone: r.responsibleInfo?.phone,
      responsibleRelation: r.responsibleInfo?.relation,
      responsibleDocument: r.responsibleInfo?.document,
      responsibleEmail: r.responsibleInfo?.email,
      parentalAuthorization: r.parentalAuthorization,
      paymentReferenceId: r.payment?.referenceId,
      paymentConfirmed: r.payment?.paymentConfirmed,
      paymentName: r.payment?.name,
      paymentCpf: r.payment?.cpf,
      paymentEmail: r.payment?.email,
      paymentPhone: r.payment?.phone,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }));

    const fields = [
      { label: 'Nome da Criança', value: 'childName' },
      { label: 'Data de Nascimento', value: 'birthDate' },
      { label: 'Idade', value: 'age' },
      { label: 'Gênero', value: 'gender' },
      { label: 'Documento da Criança', value: 'identityDocument' },
      { label: 'Endereço', value: 'address' },
      { label: 'Membro de Igreja', value: 'churchMembership' },
      { label: 'Nome da Igreja', value: 'churchName' },
      { label: 'Plano de Saúde', value: 'healthInsurance' },
      { label: 'Medicamentos', value: 'medications' },
      { label: 'Alergias', value: 'allergies' },
      { label: 'Necessidades Especiais', value: 'specialNeeds' },
      { label: 'Nome do Responsável', value: 'responsibleName' },
      { label: 'Telefone do Responsável', value: 'responsiblePhone' },
      { label: 'Relação com a Criança', value: 'responsibleRelation' },
      { label: 'Documento do Responsável', value: 'responsibleDocument' },
      { label: 'Email do Responsável', value: 'responsibleEmail' },
      { label: 'Autorização dos Pais', value: 'parentalAuthorization' },
      { label: 'ID do Pagamento', value: 'paymentReferenceId' },
      { label: 'Pagamento Confirmado', value: 'paymentConfirmed' },
      { label: 'Nome no Pagamento', value: 'paymentName' },
      { label: 'CPF no Pagamento', value: 'paymentCpf' },
      { label: 'Email no Pagamento', value: 'paymentEmail' },
      { label: 'Telefone no Pagamento', value: 'paymentPhone' },
      { label: 'Criado em', value: 'createdAt' },
      { label: 'Atualizado em', value: 'updatedAt' },
    ];
    const parser = new Parser({ fields });
    const csv = parser.parse(flatRegistrations);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="inscricoes2025.csv"'
    );
    res.status(200).send(csv);
  } catch (error) {
    console.error('Error in /export:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
