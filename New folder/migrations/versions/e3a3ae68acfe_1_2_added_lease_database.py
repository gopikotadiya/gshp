"""1.2 Added lease database

Revision ID: e3a3ae68acfe
Revises: 2f3936e3f436
Create Date: 2025-04-17 09:41:58.537541

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e3a3ae68acfe'
down_revision: Union[str, None] = '2f3936e3f436'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.create_table('leases',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('application_id', sa.Integer(), sa.ForeignKey('applications.id'), unique=True, nullable=False),
        sa.Column('apartment_id', sa.Integer(), sa.ForeignKey('apartments.id'), nullable=False),
        sa.Column('tenant_id', sa.Integer(), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('start_date', sa.DateTime(), nullable=False),
        sa.Column('end_date', sa.DateTime(), nullable=False),
        sa.Column('monthly_rent', sa.Numeric(precision=10, scale=2), nullable=False),
        sa.Column('deposit_amount', sa.Numeric(precision=10, scale=2), nullable=False),
        sa.Column('payment_due_day', sa.Integer(), nullable=False),
        sa.Column('lease_status', sa.String(), server_default='active'),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.text('now()')),
        sa.Column('is_deleted', sa.Boolean(), server_default='false'),
        sa.ForeignKeyConstraint(['application_id'], ['applications.id']),
        sa.ForeignKeyConstraint(['apartment_id'], ['apartments.id']),
        sa.ForeignKeyConstraint(['tenant_id'], ['users.id'])
    )

    op.create_table('payments',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('lease_id', sa.Integer(), sa.ForeignKey('leases.id'), nullable=False),
        sa.Column('amount', sa.Numeric(precision=10, scale=2), nullable=False),
        sa.Column('payment_date', sa.DateTime(), nullable=True),
        sa.Column('payment_method', sa.String(), nullable=True),
        sa.Column('status', sa.String(), server_default='pending'),
        sa.Column('due_date', sa.DateTime(), nullable=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()')),
        sa.Column('is_deleted', sa.Boolean(), server_default='false'),
        sa.ForeignKeyConstraint(['lease_id'], ['leases.id'])
    )

    op.create_table('security_deposits',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('lease_id', sa.Integer(), sa.ForeignKey('leases.id'), nullable=False),
        sa.Column('amount', sa.Numeric(precision=10, scale=2), nullable=False),
        sa.Column('deposit_date', sa.DateTime(), nullable=False),
        sa.Column('returned_date', sa.DateTime(), nullable=True),
        sa.Column('deductions', sa.Numeric(precision=10, scale=2), server_default='0'),
        sa.Column('status', sa.String(), server_default='held'),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()')),
        sa.Column('is_deleted', sa.Boolean(), server_default='false'),
        sa.ForeignKeyConstraint(['lease_id'], ['leases.id'])
    )

    op.create_index(op.f('ix_leases_application_id'), 'leases', ['application_id'], unique=True)
    op.create_index(op.f('ix_leases_apartment_id'), 'leases', ['apartment_id'])
    op.create_index(op.f('ix_leases_tenant_id'), 'leases', ['tenant_id'])
    op.create_index(op.f('ix_payments_lease_id'), 'payments', ['lease_id'])
    op.create_index(op.f('ix_security_deposits_lease_id'), 'security_deposits', ['lease_id'])


def downgrade():
    op.drop_table('security_deposits')
    op.drop_table('payments')
    op.drop_table('leases')
