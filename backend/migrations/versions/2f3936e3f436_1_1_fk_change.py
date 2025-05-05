"""1.1 FK change

Revision ID: 2f3936e3f436
Revises: 3cbfa767cd49
Create Date: 2025-04-14 18:21:09.266684

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '2f3936e3f436'
down_revision: Union[str, None] = '3cbfa767cd49'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.add_column('background_checks', sa.Column('application_id', sa.Integer(), nullable=False))
    op.create_foreign_key('fk_background_checks_application_id', 'background_checks', 'applications', ['application_id'], ['id'])

def downgrade():
    op.drop_constraint('fk_background_checks_application_id', 'background_checks', type_='foreignkey')
    op.drop_column('background_checks', 'application_id')
